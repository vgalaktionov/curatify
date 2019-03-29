import { Artist, ArtistTrack } from "./../../types";
import * as db from "./db";
import sql from "pg-template-tag";

export async function upsertArtists(artists: Artist[]) {
  await db.query(sql`
    INSERT INTO artists (id, name, genres, images)
      VALUES ${db.values(
        artists,
        "id",
        "name",
        { key: "genres", def: [], json: true },
        { key: "images", def: [], json: true }
      )}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      genres = EXCLUDED.genres,
      images = EXCLUDED.images;
  `);
}

export async function upsertArtistTracks(artistTracks: ArtistTrack[]) {
  await db.query(sql`
    INSERT INTO artists_tracks (track_id, artist_id)
      VALUES ${db.values(artistTracks, "track_id", "artist_id")}
    ON CONFLICT (track_id, artist_id) DO NOTHING;
  `);
}

export async function allIds(): Promise<string[]> {
  const res = await db.query(sql`SELECT id FROM artists;`);
  return res.rows.map(r => r.id);
}
