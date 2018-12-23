-- :name upsert-user! :! :n
-- :doc creates a new user record
INSERT INTO users
(id, email, display_name, token)
VALUES (:id, :email, :display_name, :token)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    token = EXCLUDED.token;

-- :name get-user-ids-and-tokens :? :*
-- :doc retrieves all spotify tokens
SELECT id, token FROM users;

-- :name upsert-playlists! :! :n
-- :doc inserts or updates multiple playlists
insert into playlists
(id, user_id, name, curated, images)
values :t*:playlists
on conflict (id) do update set
    name = EXCLUDED.name,
    images = EXCLUDED.images;


-- :name get-user-playlist-ids :? :*
-- :doc retrieves user playlist ids
select id from playlists where user_id = :id;


-- :name upsert-tracks! :! :n
-- :doc inserts or updates multiple tracks
insert into tracks
(id, name)
values :t*:tracks
on conflict (id) do nothing;


-- :name wipe-playlist-tracks! :! :n
-- :doc removes all tracks for a playlist
delete from playlists_tracks where playlist_id = :id;


-- :name insert-playlist-tracks! :! :n
-- :doc inserts or updates multiple tracks
insert into playlists_tracks
(track_id, playlist_id)
values :t*:playlist-tracks
on conflict (track_id, playlist_id) do nothing;

-- :name insert-artists! :! :n
-- :doc inserts or updates multiple artists
insert into artists
(id, name, images)
values :t*:artists
on conflict (id) do nothing;


-- :name insert-artist-tracks! :! :n
-- :doc inserts or updates multiple tracks
insert into artists_tracks
(track_id, artist_id)
values :t*:artist-tracks
on conflict (track_id, artist_id) do nothing;