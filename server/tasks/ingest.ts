import { SpotifyClient, SpotifyUserClient } from "../../lib/spotify";
import { upsertUser, allUsers } from "../data/users";
import { upsertPlaylists, userNotIgnoredPlaylists } from "../data/playlists";
import { upsertTracks, upsertPlaylistTracks, wipePlaylistTracks } from "../data/tracks";
import { upsertArtistTracks, upsertArtists, allIds } from "../data/artists";
import { updateUserInbox, enrichInbox } from "../data/inbox";
import { Token, User, Track, Artist } from "../../types";
import { uniqueBy, chunks, pick } from "../../lib/util";
import log, { time } from "../logger";

function expiring({ expiresAt }: Token): boolean {
  return Date.now() / 1000 > expiresAt - 60;
}

export async function updateUserToken(user: User): Promise<User> {
  if (expiring(user.token)) {
    const client = new SpotifyUserClient(user.token);
    user.token = await client.refreshToken();
    await upsertUser(user);
  }

  return user;
}

async function ingestUserPlaylists(client: SpotifyUserClient, user: User) {
  for await (const page of client.mePlaylists()) {
    await upsertPlaylists(
      page.map(({ id, name, images }) => ({
        id,
        user_id: user.id,
        name,
        images
      }))
    );
  }
}

async function ingestUserPlaylistTracks(client: SpotifyUserClient, user: User) {
  const playlists = await userNotIgnoredPlaylists(user.id);
  await Promise.all(
    playlists.map(async playlist => {
      let tracks = [];
      for await (const page of client.playlistTracks(playlist.id)) {
        tracks.push(...page.map(t => t.track));
      }
      tracks = uniqueBy(tracks.filter(t => t !== null).filter(t => !!t.id), "id");

      await upsertTracks(
        tracks.map(track => ({
          id: track.id,
          name: track.name
        }))
      );
      await wipePlaylistTracks(playlist.id);
      await upsertPlaylistTracks(
        tracks.map(t => ({
          track_id: t.id,
          playlist_id: playlist.id
        }))
      );
      await ingestTrackArtists(tracks);
    })
  );
}

async function ingestTrackArtists(tracks: Track[]) {
  await upsertArtists(
    uniqueBy(
      tracks
        .map(t => t.artists)
        .flat()
        .filter(a => !!a.id),
      "id"
    ).map(({ id, name }) => ({ id, name }))
  );

  await upsertArtistTracks(
    tracks
      .map(track =>
        track.artists.map(({ id }) => ({
          artist_id: id,
          track_id: track.id
        }))
      )
      .flat()
  );
}

export async function ingestForUser(user: User) {
  log.info(`ingesting for user ${user.id}...`);
  user = await updateUserToken(user);
  const client = new SpotifyUserClient(user.token);

  let start = process.hrtime();
  log.info(`ingesting playlists for user ${user.id}...`);
  await ingestUserPlaylists(client, user);
  time(`ingested playlists for user ${user.id}`, start);

  start = process.hrtime();
  log.info(`ingesting playlist tracks for user ${user.id}...`);
  await ingestUserPlaylistTracks(client, user);
  time(`ingested playlist tracks for user ${user.id}...`, start);

  start = process.hrtime();
  log.info(`ingesting inbox for user ${user.id}...`);
  await updateUserInbox(user);
  time(`updated inbox for user ${user.id}...`, start);
}

async function ingestArtistDetails(client: SpotifyClient) {
  const start = process.hrtime();
  log.info("Ingesting all artist details...");

  const ids = await allIds();
  await Promise.all(
    chunks(ids, 50).map(async chunk => {
      const artists = await client.artists(chunk);
      await upsertArtists(artists.map(a => pick(a, ["id", "name", "genres", "images"]) as Artist));
    })
  );
  time("Finished ingesting all artist details", start);
}

export async function ingestAll() {
  const start = process.hrtime();
  log.info("Ingesting  for all users...");
  try {
    const users = await allUsers();
    await Promise.all(users.map(async u => ingestForUser(u)));

    const token = await SpotifyClient.getToken();
    const genericClient = new SpotifyClient(token);
    await ingestArtistDetails(genericClient);

    const start2 = process.hrtime();
    log.info("Enriching inoxes...");
    await enrichInbox();
    time("Finished for all users", start2);
  } catch (e) {
    log.error(e);
  }
  time("Finished for all users", start);
}
