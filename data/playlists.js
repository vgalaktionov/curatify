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
