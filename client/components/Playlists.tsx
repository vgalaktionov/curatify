import React, { useEffect, useState } from "react";

import { useStore, useActions } from "../store";
import PlaylistRow from "./PlaylistRow";
import { Playlist } from "../../types";
import axios from "axios";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return width;
}

export default function Playlists() {
  const playlists = useStore(state => state.playlists.playlists);
  const initialFetch = useActions(actions => actions.playlists.getPlaylists);
  useEffect(() => {
    initialFetch();
  }, []);

  const width = useWindowWidth();

  let list;
  if (width > 1200) {
    const col1: Playlist[] = [];
    const col2: Playlist[] = [];
    playlists.forEach((p, i) => {
      i % 2 === 0 ? col1.push(p) : col2.push(p);
    });
    list = [col1, col2];
  } else {
    list = [playlists];
  }

  return (
    <div className="columns is-centered">
      {list.map((c, i) => (
        <div className="column is-4 has-text-centered">
          <table className="table center-table playlist-table">
            <tbody>
              {c.map(p => {
                return <PlaylistRow key={p.id + i} playlist={p} />;
              })}
            </tbody>
          </table>
        </div>
      ))}
      <div className="column is-3 has-text-centered">
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
