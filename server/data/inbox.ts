import * as db from "./db";
import { User } from "./users";
import sql from "pg-template-tag";

export interface InboxTrack {
  user_id: string;
  track_id: string;
  genres: string[];
  artists: string[];
}

export enum Status {
  Unheard = "unheard",
  Liked = "liked",
  Disliked = "disliked"
}

export async function updateUserInbox({ id }: User) {
  await db.query(sql`
    INSERT INTO inbox
    (user_id, track_id)
    SELECT p.user_id, pt.track_id
    FROM playlists_tracks pt
    INNER JOIN playlists p ON p.id = pt.playlist_id
    WHERE p.user_id = ${id}
    AND p.playlist_type = 'inbox'
    ON CONFLICT (user_id, track_id) DO NOTHING;
  `);
}

export async function userUnheardInbox({ id }: User): Promise<InboxTrack[]> {
  const res = await db.query(
    sql`SELECT * FROM inbox WHERE user_id = ${id} AND status = 'unheard';`
  );
  return res.rows;
}

export async function userUnheardInboxRich({
  id
}: User): Promise<InboxTrack[]> {
  const res = await db.query(sql`
    SELECT *, t.name FROM inbox i
      INNER JOIN tracks t ON t.id = i.track_id
    WHERE i.user_id = ${id}
    AND i.status = 'unheard';
  `);

  return res.rows;
}

export async function enrichInbox() {
  await db.query(sql`
    UPDATE inbox
    SET artists = temp.artists,
      genres = temp.genres,
      artist_names = temp.artist_names
    FROM (
      SELECT
        i.track_id,
        json_agg(artist_id) AS artists,
        json_agg(a.name) AS artist_names,
        json_array_elements(json_agg(a.genres)) AS genres
      FROM inbox i
      INNER JOIN artists_tracks at ON at.track_id = i.track_id
      INNER JOIN artists a ON a.id = AT.artist_id
      GROUP BY i.track_id
    ) AS temp
    WHERE inbox.track_id = temp.track_id;
  `);
}

export async function updateTrackPlaylistMatches(
  playlistId: string,
  trackId: string,
  userId: string
) {
  await db.query(sql`
    UPDATE inbox SET
      playlist_matches = ${playlistId}
    WHERE track_id = ${trackId} AND user_id = ${userId};
  `);
}

export async function updateTrackStatus(
  trackId: string,
  userId: string,
  status: Status
) {
  await db.query(sql`
    UPDATE inbox SET
      status = ${status}
    WHERE track_id = ${trackId} AND user_id = ${userId};
  `);
}
