import * as db from './db'
import sql from 'pg-template-tag'

export async function upsertPlaylists(playlists) {
  const values = sql.join(playlists.map(
    ({ id, user_id, name, images }) => sql `(${id}, ${user_id}, ${name}, ${images}::jsonb)`),
    ', '
  )

  await db.query(sql `
    INSERT INTO playlists (id, user_id, name, images)
      VALUES ${values}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      images =  EXCLUDED.images;
  `)
}

export async function userPlaylists(userId) {
  return db.query(sql `SELECT * FROM playlists WHERE user_id = ${userId};`)
}

export async function userCuratedPlaylists(userId) {
  return db.query(
    sql `SELECT * FROM playlists WHERE user_id = ${userId} AND playlist_type = 'curated';`
  )
}

export async function allPlaylists() {
  return db.query(sql `SELECT * FROM playlists;`)
}

export async function updatePlaylistArtistAffinities({ id }) {
  await db.query(sql `
    WITH aff AS (
      SELECT jsonb_object_agg(temp.artist_id, temp.count) as aff
      FROM (
        SELECT
          art.artist_id,
          count(art.track_id) /
            (SELECT count(*) FROM playlists_tracks WHERE playlist_id = ${id})::numeric AS count
        FROM artists a
          INNER JOIN artists_tracks art ON art.artist_id = a.id
          INNER JOIN playlists_tracks pt ON pt.track_id = art.track_id
          INNER JOIN playlists p ON pt.playlist_id = p.id
        WHERE p.id = ${id}
        GROUP BY a.name, art.artist_id
      ) AS temp
    )
    UPDATE playlists SET artist_affinities = aff.aff FROM aff WHERE playlists.id = ${id};
  `)
}

export async function updatePlaylistGenreAffinities({ id }) {
  await db.query(sql `
    WITH playlist_track_count AS (SELECT count(*) FROM playlists_tracks WHERE playlist_id = ${id}),
    aff AS (
      SELECT jsonb_object_agg(agg.genre, agg.count) AS aff
      FROM (
        SELECT
          genre, count(*) / playlist_track_count::numeric AS count
        FROM (
          SELECT jsonb_array_elements_text(a.genres) AS genre FROM artists a
            INNER JOIN artists_tracks art ON art.artist_id = a.id
            INNER JOIN playlists_tracks pt ON pt.track_id = art.track_id
            INNER JOIN playlists p ON pt.playlist_id = p.id
          WHERE p.id = ${id}
        ) AS temp
        GROUP BY temp.genre
      ) AS agg)
    UPDATE playlists SET genre_affinities = aff.aff FROM aff WHERE playlists.id = ${id};
  `)
}

export async function updatePlaylistType(id, type) {
  await db.query(sql `update playlists set playlist_type = ${type} where id = ${id};`)
}
