alter table playlists
add column playlist_type text default 'ignored',
drop column curated,
drop column inbox;
