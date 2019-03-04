import * as db from './db'
import sql, { join } from 'pg-template-tag'

export async function upsertArtists(artists) {
  const values = join(artists.map(({ id, name, genres = {}, images = {} }) => {
    return sql `(${id}, ${name}, ${JSON.stringify(genres)}, ${JSON.stringify(images)})`
  }), ', ')

  await db.query(sql `
    INSERT INTO artists (id, name, genres, images)
      VALUES ${values}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      genres = EXCLUDED.genres,
      images = EXCLUDED.images;
  `)
}

export async function upsertArtistTracks(artistTracks) {
  const values = join(artistTracks.map(({
    track_id,
    artist_id
  }) => sql `(${track_id}, ${artist_id})`), ', ')

  await db.query(sql `
    INSERT INTO artists_tracks (track_id, artist_id)
      VALUES ${values}
    ON CONFLICT (track_id, artist_id) DO NOTHING;
  `)
}

export async function allIds() {
  const res = await db.query(sql `SELECT id FROM artists;`)
  return res.rows.map('id')
}
