import {
  updatePlaylistArtistAffinities,
  updatePlaylistGenreAffinities,
  allPlaylists,
  userCuratedPlaylists
} from "../data/playlists";
import { userUnheardInbox, updateTrackPlaylistMatches } from "../data/inbox";
import { allUsers } from "../data/users";
import { Playlist, User } from "../../types";
import { maxKey, sum, pick } from "../../lib/util";
import log, { time } from "../logger";

export async function analyzeAll() {
  const start = process.hrtime();
  log.info("Analyzing for all users...");

  await updateAffinities();

  const users = await allUsers();
  await Promise.all(
    users.map(async user => {
      log.info(`Analyzing for user ${user.id}...`);
      await calculateTrackPlaylistMatches(user);
      log.info(`Analyzed for user ${user.id}`);
    })
  );
  time("Analyzing for all users complete", start);
}

export async function updateAffinities() {
  const start = process.hrtime();
  log.info("Updating affinities for all users...");

  const playlists = await allPlaylists();
  await Promise.all(
    playlists.map(async (p: Playlist) => {
      await updatePlaylistArtistAffinities(p);
      await updatePlaylistGenreAffinities(p);
    })
  );
  time("Finished updating affinities", start);
}

export async function calculateTrackPlaylistMatches(user: User) {
  const start = process.hrtime();
  log.info(`Calculating track playlist matches for user ${user.id}...`);

  const playlists = await userCuratedPlaylists(user.id);
  const unheard = await userUnheardInbox(user);

  await Promise.all(
    unheard.map(async track => {
      const match: string = maxKey(
        playlists.reduce((acc: Map<string, number>, playlist: Playlist) => {
          const genreScore = sum(
            Object.values(pick(playlist.genre_affinities || {}, track.genres))
          );

          const artistScore = sum(
            Object.values(pick(playlist.artist_affinities || {}, track.artists))
          );
          return {
            [playlist.id]: artistScore + genreScore,
            ...acc
          };
        }, {})
      );
      await updateTrackPlaylistMatches(match, track.track_id, user.id);
    })
  );
  time(`Finished calculating track playlist matches for user ${user.id}`, start);
}
