import { db } from './db'


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

export async function userUnheardInbox({ id }) {
  return db.any(`SELECT * FROM inbox WHERE user_id = $1 AND status = 'unheard';`, [id])
}

export async function userUnheardInboxRich({ id }) {
  return db.any(`
  SELECT *, t.name FROM inbox i
    INNER JOIN tracks t ON t.id = i.track_id
  WHERE i.user_id = $1
  AND i.status = 'unheard';
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
      json_agg(a.name) as artist_names,
      json_array_elements(json_agg(a.genres)) as genres
    from inbox i
    inner join artists_tracks at on at.track_id = i.track_id
    inner join artists a on a.id = at.artist_id
    group by i.track_id
  ) as temp
  where inbox.track_id = temp.track_id;
  `)
}


export async function updateTrackPlaylistMatches(playlistId, trackId, userId) {
  await db.none(`
  UPDATE inbox SET playlist_matches = $1 WHERE track_id = $2 AND user_id = $3;
  `, [playlistId, trackId, userId])
}
