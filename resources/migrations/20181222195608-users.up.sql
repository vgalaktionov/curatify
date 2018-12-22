CREATE TABLE users
(
  id           CHARACTER VARYING(256) PRIMARY KEY,
  email        TEXT,
  display_name TEXT,
  token        jsonb
);
