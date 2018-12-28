alter table playlists
drop column playlist_type,
add column curated boolean,
add column inbox boolean;