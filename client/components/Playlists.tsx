import React from "react";

import { useStore } from "../store";
import PlaylistRow from "./PlaylistRow";
import { Playlist } from "../../types";

export default function Playlists() {
  const playlists = useStore(state => state.playlists.playlists);
  const col1: Playlist[] = [];
  const col2: Playlist[] = [];
  playlists.forEach((p, i) => {
    i % 2 === 0 ? col1.push(p) : col2.push(p);
  });
  return (
    <div className="columns is-centered">
      {[col1, col2].map(c => (
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
              {c.map(p => {
                return <PlaylistRow key={p.id} playlist={p} />;
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
