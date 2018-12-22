CREATE TABLE playlists
(
  id      CHARACTER VARYING(32) PRIMARY KEY,
  user_id CHARACTER VARYING(256) REFERENCES users (id),
  name    TEXT,
  curated BOOLEAN,
  images  jsonb
);
