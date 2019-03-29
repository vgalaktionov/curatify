import * as db from "./db";
import sql from "pg-template-tag";

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  images: any[];
  artist_affinities?: Map<string, number>;
  genre_affinities?: Map<string, number>;
  playlist_type?: PlaylistType;
}

enum PlaylistType {
  Ignored = "ignored",
  Curated = "curated",
  Inbox = "inbox"
}

export async function upsertPlaylists(playlists: Playlist[]) {
  await db.query(sql`INSERT INTO playlists (id, user_id, name, images)
      VALUES ${db.values(playlists, "id", "user_id", "name", {
        key: "images",
        json: true
      })}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      images =  EXCLUDED.images;`);
}

export async function userPlaylists(userId: string) {
  const res = await db.query(
    sql`SELECT * FROM playlists WHERE user_id = ${userId};`
  );
  return res.rows;
}

export async function userCuratedPlaylists(userId: string) {
  const res = await db.query(
    sql`SELECT * FROM playlists WHERE user_id = ${userId} AND playlist_type = 'curated';`
  );
  return res.rows;
}

export async function allPlaylists() {
  const res = await db.query(sql`SELECT * FROM playlists;`);
  return res.rows;
}

export async function updatePlaylistArtistAffinities({ id }: Playlist) {
  await db.query(sql`
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
  `);
}

export async function updatePlaylistGenreAffinities({ id }: Playlist) {
  await db.query(sql`
    WITH aff AS (
      SELECT jsonb_object_agg(agg.genre, agg.count) AS aff
      FROM (
        SELECT
          genre, count(*) /
            (SELECT count(*) FROM playlists_tracks WHERE playlist_id = ${id})::numeric AS count
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
  `);
}

export async function updatePlaylistType(id: string, type: PlaylistType) {
  await db.query(
    sql`update playlists set playlist_type = ${type} where id = ${id};`
  );
}
