import { db } from './db'

// with aff as (select (jsonb_each_text(genre_affinities)).*, id as playlist_id from playlists),
// 	track as (select track_id, jsonb_array_elements_text(genres)::text as genre from inbox where track_id = '7fJjJwGxgbRWZ7wR1sN7gk')
// select sum(value::numeric), playlist_id
// from aff
// inner join track on aff.key = track.genre
// group by track_id, playlist_id;
export async function updateUserInbox({ id }) {
  await db.none(`
  INSERT INTO inbox
  (user_id, track_id)
  SELECT p.user_id, pt.track_id
  FROM playlists_tracks pt
  INNER JOIN playlists p on p.id = pt.playlist_id
  WHERE p.user_id = $1
  AND p.playlist_type = 'inbox'
  ON CONFLICT (user_id, track_id) DO NOTHING;
  `, [id])
}

export async function enrichInbox() {
  await db.none(`
  update inbox
  set artists = temp.artists,
    genres = temp.genres
  from (
    select
      i.track_id,
      json_agg(artist_id) as artists,
      json_array_elements(json_agg(a.genres)) as genres
    from inbox i
    inner join artists_tracks at on at.track_id = i.track_id
    inner join artists a on a.id = at.artist_id
    group by i.track_id
  ) as temp
  where inbox.track_id = temp.track_id;
  `)
}
