import { db, pgp, upsertDoNothing, upsertDoUpdate } from './db'

const artistsCs = new pgp.helpers.ColumnSet(['id', 'name'], { table: 'artists' })
const artistTracksCs = new pgp.helpers.ColumnSet(
  ['track_id', 'artist_id'],
  { table: 'artists_tracks' }
)


export async function upsertArtists(artists) {
  await db.none(upsertDoUpdate(artists, artistsCs))
}

export async function upsertArtistTracks(artistTracks) {
  await db.none(upsertDoNothing(artistTracks, artistTracksCs, ['track_id', 'artist_id']))
}

export async function allIds() {
  const rows = await db.any("select id from artists;")
  return rows.map('id')
}
