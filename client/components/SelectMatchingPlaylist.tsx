import React from "react";

import { useActions, useStore } from "../store";
import { InboxTrack } from "../../types";

interface SelectMatchingPlaylistProps {
  track: InboxTrack;
}

export default ({ track }: SelectMatchingPlaylistProps) => {
  const playlists = useStore(state => state.playlists.playlists);
  const matchingPlaylist = playlists.find(p => p.id === track.playlist_matches);
  const setMatchingPlaylist = useActions(
    actions => actions.playback.setMatchingPlaylist
  );
  return (
    <div className="field">
      <label htmlFor="matches" className="is-small">
        matches:
        <div className="control is-centered has-text-centered">
          <span className="select">
            <select
              name="matches"
              className="is-small"
              defaultValue={matchingPlaylist.id}
              onChange={async e => {
                await setMatchingPlaylist({
                  trackId: track.track_id,
                  playlistId: e.target.value
                });
              }}
            >
              {playlists.map(playlist => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </span>
        </div>
      </label>
    </div>
  );
};
