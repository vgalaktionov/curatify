CREATE TABLE artists
(
  id     CHARACTER VARYING(32) PRIMARY KEY,
  name   TEXT,
  genres jsonb,
  images jsonb
);
