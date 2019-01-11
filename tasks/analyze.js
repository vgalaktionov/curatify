import consola from 'consola'
import {
  updatePlaylistArtistAffinities, updatePlaylistGenreAffinities, allPlaylists, userPlaylists, userCuratedPlaylists
} from '../data/playlists'
import { timeAsyncCall } from '../lib/timing'
import { userUnheardInbox, updateTrackPlaylistMatches } from '../data/inbox'
import { allUsers } from '../data/users'


export async function analyzeAll() {
  await timeAsyncCall(
    'analyzing all...',
    async () => {
      const playlists = await allPlaylists()
      await Promise.all(playlists.map(async p => {
        await updatePlaylistArtistAffinities(p)
        await updatePlaylistGenreAffinities(p)
      }))

      const users = await allUsers()
      await Promise.all(users.map(async user => {
        consola.info(`analyzing for user ${user.id}...`)
        await calculateTrackPlaylistMatches(user)
      }))
    },
    'analyzed all'
  )
}


async function calculateTrackPlaylistMatches(user) {
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
      return { [playlist.id]: artistScore + genreScore, ...acc }
    }, {}))
    await updateTrackPlaylistMatches(match, track.track_id, user.id)
  }))
}
