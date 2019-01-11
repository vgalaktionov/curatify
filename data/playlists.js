import { db, pgp, upsertDoUpdate } from './db'

const cs = new pgp.helpers.ColumnSet(
  [
    'id',
    'user_id',
    'name',
    'images:json',
    {
      name: 'artist_affinities',
      mod: ':json',
      def: {}
    },
    {
      name: 'genre_affinities',
      mod: ':json',
      def: {}
    },
    {
      name: 'playlist_type',
      def: 'ignored'
    }
  ],
  { table: 'playlists' }
)

export async function upsertPlaylists(playlists) {
  await db.none(upsertDoUpdate(playlists, cs, ['id'], 'playlist_type'))
}

export async function userPlaylists(userId) {
  return db.any('SELECT * FROM playlists WHERE user_id = $1;', [userId])
}

export async function userCuratedPlaylists(userId) {
  return db.any(
    `SELECT * FROM playlists WHERE user_id = $1 AND playlist_type = 'curated';`, [userId]
  )
}

export async function allPlaylists() {
  return db.any('SELECT * FROM playlists;')
}

export async function updatePlaylistArtistAffinities({ id }) {
  await db.none(`
  with aff as (
		select jsonb_object_agg(temp.artist_id, temp.count) as aff
		from (
      select
        art.artist_id,
        count(art.track_id) /
          (select count(*) from playlists_tracks where playlist_id = $1)::numeric as count
      from artists a
        inner join artists_tracks art on art.artist_id = a.id
        inner join playlists_tracks pt on pt.track_id = art.track_id
        inner join playlists p on pt.playlist_id = p.id
      where p.id = $1
      group by a.name, art.artist_id
    ) as temp
	)
  update playlists set artist_affinities = aff.aff from aff where playlists.id = $1;
  `, [id])
}

export async function updatePlaylistGenreAffinities({ id }) {
  await db.none(`
  with aff as (
    select jsonb_object_agg(agg.genre, agg.count) as aff
    from (select
      genre,
      count(*) / (select count(*) from playlists_tracks where playlist_id = $1)::numeric as count
      from (
        select jsonb_array_elements_text(a.genres) as genre from artists a
          inner join artists_tracks art on art.artist_id = a.id
          inner join playlists_tracks pt on pt.track_id = art.track_id
          inner join playlists p on pt.playlist_id = p.id
        where p.id = $1
      ) as temp
      group by temp.genre
    ) as agg)
  update playlists set genre_affinities = aff.aff from aff where playlists.id = $1;
  `, [id])
}
