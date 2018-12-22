CREATE TABLE playlists_tracks
(
  playlist_id CHARACTER VARYING(32) REFERENCES playlists (id),
  track_id    CHARACTER VARYING(32) REFERENCES tracks (id),
  CONSTRAINT unq_playlist_track UNIQUE (playlist_id,
                                        track_id)
);
