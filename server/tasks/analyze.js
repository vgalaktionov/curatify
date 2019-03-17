import {
  updatePlaylistArtistAffinities,
  updatePlaylistGenreAffinities,
  allPlaylists,
  userCuratedPlaylists
} from '../data/playlists'
import { userUnheardInbox, updateTrackPlaylistMatches } from '../data/inbox'
import { allUsers } from '../data/users'

export async function analyzeAll () {
  const playlists = await allPlaylists()

  await Promise.all(playlists.map(async p => {
    await updatePlaylistArtistAffinities(p)
    await updatePlaylistGenreAffinities(p)
  }))

  const users = await allUsers()

  await Promise.all(users.map(async user => {
    console.info(`analyzing for user ${user.id}...`)
    await calculateTrackPlaylistMatches(user)
  }))
}

async function calculateTrackPlaylistMatches (user) {
  const playlists = await userCuratedPlaylists(user.id)
  const unheard = await userUnheardInbox(user)

  await Promise.all(unheard.map(async track => {
    const match = Object.max(playlists.reduce((acc, playlist) => {
      const genreScore = Object.values(
        Object.select(playlist.genre_affinities, track.genres)
      ).sum()

      const artistScore = Object.values(
        Object.select(playlist.artist_affinities, track.artists)
      ).sum()
      return {
        [playlist.id]: artistScore + genreScore,
        ...acc
      }
    }, {}))
    await updateTrackPlaylistMatches(match, track.track_id, user.id)
  }))
}
