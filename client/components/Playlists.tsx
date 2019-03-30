import React, { useEffect } from "react";

import { useStore, useActions } from "../store";
import PlaylistRow from "./PlaylistRow";
import { Playlist } from "../../types";
import axios from "axios";
import { async } from "q";

export default function Playlists() {
  const playlists = useStore(state => state.playlists.playlists);
  const initialFetch = useActions(actions => actions.playlists.getPlaylists);
  useEffect(() => {
    initialFetch();
  }, []);

  const col1: Playlist[] = [];
  const col2: Playlist[] = [];
  playlists.forEach((p, i) => {
    i % 2 === 0 ? col1.push(p) : col2.push(p);
  });

  return (
    <div className="columns is-centered">
      {[col1, col2].map((c, i) => (
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
                return <PlaylistRow key={p.id + i} playlist={p} />;
              })}
            </tbody>
          </table>
        </div>
      ))}
      <div className="column is-narrow is-3 has-text-centered">
        <button
          className="button is-outlined is-info"
          onClick={async () => {
            await axios.post("/api/inbox/refetch");
          }}
        >
          Fetch data from Spotify now
        </button>
        <br />
        <br />
        <p>
          We refresh your Spotify data every 5 minutes, but you can trigger a manual refresh if
          needed.
        </p>
      </div>
    </div>
  );
}
