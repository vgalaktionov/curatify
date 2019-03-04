import * as db from './db'
import sql, { join } from 'pg-template-tag'

export async function upsertTracks(tracks) {
  const values = join(tracks.map(({ id, name }) => sql `(${id}, ${name})`), ', ')

  await db.query(sql `
    INSERT INTO tracks (id, name)
      VALUES ${values}
    ON CONFLICT (id) DO NOTHING;
  `)
}

export async function upsertPlaylistTracks(playlistTracks) {
  const values = join(
    playlistTracks.map(({ track_id, playlist_id }) => sql `(${track_id}, ${playlist_id})`), ', '
  )

  await db.query(sql `
    INSERT INTO playlists_tracks (track_id, playlist_id)
      VALUES ${values}
    ON CONFLICT (track_id, playlist_id) DO NOTHING;
  `)
}

export async function wipePlaylistTracks(playlistId) {
  await db.query(sql `DELETE FROM playlists_tracks WHERE playlist_id = ${playlistId};`)
}
