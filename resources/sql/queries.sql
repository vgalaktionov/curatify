-- :name upsert-user! :! :n
-- :doc creates a new user record
INSERT INTO users
(id, email, display_name, token)
VALUES (:id, :email, :display_name, :token)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    token = EXCLUDED.token;


-- :name get-users :? :*
-- :doc retrieves all users
SELECT * FROM users;


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


-- :name get-playlist-ids :? :*
-- :doc retrieves playlist ids
select id from playlists;


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
(id, name)
values :t*:artists
on conflict (id) do nothing;


-- :name insert-artist-tracks! :! :n
-- :doc inserts or updates multiple tracks
insert into artists_tracks
(track_id, artist_id)
values :t*:artist-tracks
on conflict (track_id, artist_id) do nothing;


-- :name get-artist-ids :? :*
-- :doc retrieves all artist ids
select id from artists;


-- :name enrich-artists! :! :n
-- :doc updates artist with images & genres
insert into artists
(id, images, genres)
values :t*:artists
on conflict (id) do update set
    genres = EXCLUDED.genres,
    images = EXCLUDED.images;


-- :name playlist-artist-affinity :? :*
-- :doc retrieves artist counts for playlist id
select art.artist_id, count(art.track_id), a.name from artists a
  inner join artists_tracks art on art.artist_id = a.id
  inner join playlists_tracks pt on pt.track_id = art.track_id
  inner join playlists p on pt.playlist_id = p.id
where p.id = :playlist-id
group by a.name, art.artist_id;


-- :name playlist-genre-affinity :? :*
-- :doc retrieves genre counts for playlist id
select genre, count(*) from (
  select jsonb_array_elements_text(a.genres) as genre from artists a
    inner join artists_tracks art on art.artist_id = a.id
    inner join playlists_tracks pt on pt.track_id = art.track_id
    inner join playlists p on pt.playlist_id = p.id
  where p.id = :playlist-id
) temp
group by temp.genre;


-- :name playlist-track-count :? :1
-- :doc retrieves playlist count
select count(*) from playlists_tracks where playlist_id = :playlist-id;


-- :name update-artist-affinities! :! :n
-- :doc updates affinities for playlist
update playlists set artist_affinities = :aa where id = :playlist-id;


-- :name update-genre-affinities! :! :n
-- :doc updates affinities for playlist
update playlists set genre_affinities = :ga where id = :playlist-id;


-- :name update-inbox! :! :n
-- :doc puts tracks from inbox-marked playlists into the inbox table
insert into inbox
(user_id, track_id)
select p.user_id, pt.track_id
from playlists_tracks pt
inner join playlists p on p.id = pt.playlist_id
where p.user_id = :id
and p.inbox = true
on conflict (user_id, track_id) do nothing;


-- :name get-user-inbox :? :*
-- :doc puts tracks from inbox-marked playlists into the inbox table
select t.id, t.name from inbox i
inner join tracks t on t.id = i.track_id
where i.user_id = :id;


-- :name enrich-inbox! :! :n
-- :doc denormalizes artists and tracks
update inbox
set artists = temp.artists,
	genres = temp.genres
from (
select i.track_id, json_agg(artist_id) as artists, json_array_elements(json_agg(a.genres)) as genres from inbox i
	inner join artists_tracks at on at.track_id = i.track_id
	inner join artists a on a.id = at.artist_id
	group by i.track_id
) as temp
where inbox.track_id = temp.track_id;