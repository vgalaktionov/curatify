import {
  updatePlaylistArtistAffinities,
  updatePlaylistGenreAffinities,
  allPlaylists,
  userCuratedPlaylists
} from "../data/playlists";
import { userUnheardInbox, updateTrackPlaylistMatches } from "../data/inbox";
import { allUsers } from "../data/users";
import { Playlist, User } from "../../types";

export async function analyzeAll() {
  const playlists = await allPlaylists();

  await Promise.all(
    playlists.map(async (p: Playlist) => {
      await updatePlaylistArtistAffinities(p);
      await updatePlaylistGenreAffinities(p);
    })
  );

  const users = await allUsers();

  await Promise.all(
    users.map(async user => {
      await calculateTrackPlaylistMatches(user);
      console.info(`analyzed for user ${user.id}...`);
    })
  );
}

async function calculateTrackPlaylistMatches(user: User) {
  const playlists = await userCuratedPlaylists(user.id);
  const unheard = await userUnheardInbox(user);

  await Promise.all(
    unheard.map(async track => {
      const match: string = Object.max(
        playlists.reduce((acc: Map<string, number>, playlist: Playlist) => {
          const genreScore = Object.values(
            Object.pick(playlist.genre_affinities, track.genres)
          ).sum();

          const artistScore = Object.values(
            Object.pick(playlist.artist_affinities, track.artists)
          ).sum();
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
