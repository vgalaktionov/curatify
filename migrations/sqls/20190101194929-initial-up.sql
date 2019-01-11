CREATE TABLE users (
  id CHARACTER VARYING (256) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  token jsonb
);

CREATE TABLE playlists (
  id CHARACTER VARYING (32) PRIMARY KEY,
  user_id CHARACTER VARYING (256) REFERENCES users (id),
  name TEXT,
  images jsonb,
  artist_affinities jsonb,
  genre_affinities jsonb,
  playlist_type CHARACTER varying (7) DEFAULT 'ignored'
);

CREATE TABLE tracks (
  id CHARACTER VARYING (32) PRIMARY KEY,
  name TEXT
);

CREATE TABLE artists (
  id CHARACTER VARYING (32) PRIMARY KEY,
  name TEXT,
  genres jsonb,
  images jsonb
);

CREATE TABLE playlists_tracks (
  playlist_id CHARACTER VARYING (32) REFERENCES playlists (id),
  track_id CHARACTER VARYING (32) REFERENCES tracks (id),
  CONSTRAINT unq_playlist_track UNIQUE (playlist_id,
    track_id)
);

CREATE TABLE artists_tracks (
  artist_id CHARACTER VARYING (32) REFERENCES artists (id),
  track_id CHARACTER VARYING (32) REFERENCES tracks (id),
  CONSTRAINT unq_artist_track UNIQUE (artist_id,
    track_id)
);

CREATE TABLE inbox (
  user_id CHARACTER VARYING (256) REFERENCES users (id),
  track_id CHARACTER VARYING (32) REFERENCES tracks (id),
  artists jsonb,
  genres jsonb,
  playlist_affinities jsonb DEFAULT '{}' ::jsonb,
  status CHARACTER varying (8) DEFAULT 'ignored',
  CONSTRAINT unq_user_track UNIQUE (user_id,
    track_id)
);

