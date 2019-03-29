import { Artist } from "./artists";
import * as db from "./db";
import sql from "pg-template-tag";

export interface Track {
  id: string;
  name: string;
  artists?: Artist[];
}

export interface PlaylistTrack {
  playlist_id: string;
  track_id: string;
}

export async function upsertTracks(tracks: Track[]) {
  await db.query(sql`
    INSERT INTO tracks (id, name)
      VALUES ${db.values(tracks, "id", "name")}
    ON CONFLICT (id) DO NOTHING;
  `);
}

export async function upsertPlaylistTracks(playlistTracks: PlaylistTrack[]) {
  await db.query(sql`
    INSERT INTO playlists_tracks (track_id, playlist_id)
      VALUES ${db.values(playlistTracks, "track_id", "playlist_id")}
    ON CONFLICT (track_id, playlist_id) DO NOTHING;
  `);
}

export async function wipePlaylistTracks(playlistId: string) {
  await db.query(
    sql`DELETE FROM playlists_tracks WHERE playlist_id = ${playlistId};`
  );
}
