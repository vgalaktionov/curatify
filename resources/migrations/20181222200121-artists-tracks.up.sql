CREATE TABLE artists_tracks
(
  artist_id CHARACTER VARYING(32) REFERENCES artists (id),
  track_id  CHARACTER VARYING(32) REFERENCES tracks (id),
  CONSTRAINT unq_artist_track UNIQUE (artist_id,
                                      track_id)
);
