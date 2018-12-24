CREATE TABLE inbox
(
  user_id CHARACTER VARYING(256) REFERENCES users(id),
  track_id CHARACTER VARYING (32) REFERENCES tracks(id),
  CONSTRAINT unq_user_track UNIQUE (user_id, track_id)
);
