import React from "react";

import { useStore } from "../store";
import PlaylistRow from "./PlaylistRow";

export default function Playlists() {
  const playlists = useStore(state => state.playlists.playlists);
  return (
    <div className="columns is-centered">
      <div className="column is-narrow">
        <table className="table center-table">
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {playlists.map(p => {
              return <PlaylistRow key={p.id} playlist={p} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
