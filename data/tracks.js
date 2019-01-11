import { db, pgp, upsertDoNothing } from './db'

const tracksCs = new pgp.helpers.ColumnSet(['id', 'name'], { table: 'tracks' })
const playlistTracksCs = new pgp.helpers.ColumnSet(
  ['track_id', 'playlist_id'],
  { table: 'playlists_tracks' }
)

export async function upsertTracks(tracks) {

  await db.none(upsertDoNothing(tracks, tracksCs))
}

export async function upsertPlaylistTracks(tracks) {

  await db.none(upsertDoNothing(tracks, playlistTracksCs, ['track_id', 'playlist_id']))
}

export async function wipePlaylistTracks(playlistId) {
  await db.none('DELETE FROM playlists_tracks WHERE playlist_id = $1', [playlistId])
}
