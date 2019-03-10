import * as db from './db'
import sql from 'pg-template-tag'

export async function upsertTracks (tracks) {
  await db.query(sql `
    INSERT INTO tracks (id, name)
      VALUES ${db.values(tracks, 'id', 'name')}
    ON CONFLICT (id) DO NOTHING;
  `)
}

export async function upsertPlaylistTracks (playlistTracks) {
  await db.query(sql `
    INSERT INTO playlists_tracks (track_id, playlist_id)
      VALUES ${db.values(playlistTracks, 'track_id', 'playlist_id')}
    ON CONFLICT (track_id, playlist_id) DO NOTHING;
  `)
}

export async function wipePlaylistTracks (playlistId) {
  await db.query(sql `DELETE FROM playlists_tracks WHERE playlist_id = ${playlistId};`)
}
