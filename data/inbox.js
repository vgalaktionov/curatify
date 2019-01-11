// with aff as (select (jsonb_each_text(genre_affinities)).*, id as playlist_id from playlists),
// 	track as (select track_id, jsonb_array_elements_text(genres)::text as genre from inbox where track_id = '7fJjJwGxgbRWZ7wR1sN7gk')
// select sum(value::numeric), playlist_id
// from aff
// inner join track on aff.key = track.genre
// group by track_id, playlist_id;
