import * as db from './db'
import sql from 'pg-template-tag'

export async function upsertArtists(artists) {
  const values = sql.join(artists.map(({ id, name, genres = {}, images = {} }) => {
    return sql `(${id}, ${name}, ${genres}::jsonb, ${images}::jsonb)`
  }), ', ')

  await db.query(sql `
    insert into artists (track_id, artist_id)
      values ${values}
    on conflict (id) do update set
      name = EXCLUDED.name,
      genres = EXCLUDED.genres,
      images = EXCLUDED.images;
  `)
}

export async function upsertArtistTracks(artistTracks) {
  const values = sql.join(artistTracks.map(({
    track_id,
    artist_id
  }) => sql `(${track_id}, ${artist_id})`), ', ')

  await db.query(sql `
    insert into artists_tracks (track_id, artist_id)
      values ${values}
    on conflict (track_id, artist_id) do nothing;
  `)
}

export async function allIds() {
  const rows = await db.query(sql `select id from artists;`)
  return rows.map('id')
}
