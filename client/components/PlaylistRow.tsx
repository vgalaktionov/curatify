import React from "react";

import { Playlist, PlaylistType } from "../../types";
import { useActions } from "../store";
import { minBy } from "../../lib/util";

interface PlaylistRowProps {
  playlist: Playlist;
}

export default function PlaylistRow({ playlist }: PlaylistRowProps) {
  const patchPlaylistType = useActions(actions => actions.playlists.patchPlaylistType);
  return (
    <tr>
      <td>
        <img src={minBy(playlist.images, "height").url} className="playlist-cover" />
      </td>
      <td>{playlist.name}</td>
      <td>
        <div className="select">
          <select
            defaultValue={playlist.playlist_type}
            onChange={async e => {
              await patchPlaylistType({
                id: playlist.id,
                type: e.target.value as PlaylistType
              });
            }}
          >
            {Object.values(PlaylistType).map((pt: PlaylistType) => {
              return (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              );
            })}
          </select>
        </div>
      </td>
    </tr>
  );
}
