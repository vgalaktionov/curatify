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

export async function analyzeAll() {
  await updateAffinities();

  const users = await allUsers();
  await Promise.all(
    users.map(async user => {
      await calculateTrackPlaylistMatches(user);
      console.info(`analyzed for user ${user.id}...`);
    })
  );
}

export async function updateAffinities() {
  const playlists = await allPlaylists();
  await Promise.all(
    playlists.map(async (p: Playlist) => {
      await updatePlaylistArtistAffinities(p);
      await updatePlaylistGenreAffinities(p);
    })
  );
}

export async function calculateTrackPlaylistMatches(user: User) {
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
}
