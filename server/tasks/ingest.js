import {
  SpotifyClient,
  SpotifyUserClient
} from '../../lib/spotify'
import {
  upsertUser,
  allUsers
} from '../data/users'
import {
  upsertPlaylists,
  userPlaylists
} from '../data/playlists'
import {
  upsertTracks,
  upsertPlaylistTracks,
  wipePlaylistTracks
} from '../data/tracks'
import {
  upsertArtistTracks,
  upsertArtists,
  allIds
} from '../data/artists'
import {
  updateUserInbox,
  enrichInbox
} from '../data/inbox'


function expiring({ expiresAt }) {
  return (Date.now() / 1000) > expiresAt - 60
}


export async function updateUserToken(user) {
  if (expiring(user.token)) {
    user.token = await new SpotifyUserClient(user.token).refreshToken()
    await upsertUser(user)
  }
  return user
}


async function ingestUserPlaylists(client, user) {
  for await (const page of client.mePlaylists()) {
    await upsertPlaylists(page.map(({
      id,
      name,
      images
    }) => ({
      id,
      user_id: user.id,
      name,
      images
    })))
  }
}


async function ingestUserPlaylistTracks(client, user) {
  const playlists = await userPlaylists(user.id)
  await Promise.all(playlists.map(async (playlist) => {
    let tracks = []
    for await (const page of client.playlistTracks(playlist.id)) {
      tracks.push(...page.map('track'))
    }
    tracks = tracks.filter(t => t !== null).filter(t => !!t.id).unique('id')
    await upsertTracks(tracks.map(track => ({
      id: track.id,
      name: track.name
    })))
    await wipePlaylistTracks(playlist.id)
    await upsertPlaylistTracks(tracks.map(t => ({
      track_id: t.id,
      playlist_id: playlist.id
    })))
    await ingestTrackArtists(tracks)
  }))
}


async function ingestTrackArtists(tracks) {
  await upsertArtists(tracks
    .map('artists')
    .flatten()
    .filter(a => !!a.id)
    .unique('id')
    .map(({
      id,
      name
    }) => ({
      id,
      name
    })))

  await upsertArtistTracks(tracks
    .map(track => track.artists.map(({ id }) => ({
      artist_id: id,
      track_id: track.id
    })))
    .flatten())
}


async function ingestForUser(user) {
  consola.info(`ingesting for user ${user.id}...`)
  user = await updateUserToken(user)
  const client = new SpotifyUserClient(user.token)
  await ingestUserPlaylists(client, user)
  consola.info(`ingested playlists for user ${user.id}...`)
  await ingestUserPlaylistTracks(client, user)
  consola.info(`ingested playlist tracks for user ${user.id}...`)
  await updateUserInbox(user)
  consola.info(`updated inbox for user ${user.id}...`)
}


async function ingestArtistDetails(client) {
  const ids = await allIds()
  await Promise.all(ids.inGroupsOf(50).map(async chunk => {
    const artists = await client.artists(chunk)
    await upsertArtists(artists.map(a => Object.select(a, ['id', 'name', 'genres', 'images'])))
  }))
}


export async function ingestAll() {
  const users = await allUsers()
  await Promise.all(users.map(async u => ingestForUser(u)))

  const token = await SpotifyClient.getToken()
  const genericClient = new SpotifyClient(token)
  await ingestArtistDetails(genericClient)
  await enrichInbox()
}
