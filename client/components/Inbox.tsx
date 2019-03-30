import React, { useEffect, useState, useRef } from "react";
import { useStore, useActions } from "../store";
import InboxRow from "./InboxRow";
import { InboxTrack } from "../../types";

export default function InboxList() {
  const inbox = useStore(store => store.playback.inbox);
  const currentInbox = useStore(store => store.playback.currentInbox);
  const initialFetchInbox = useActions(actions => actions.playback.getInbox);
  const initialFetchPlaylists = useActions(actions => actions.playlists.getPlaylists);
  useEffect(() => {
    if (!inbox.length) initialFetchInbox();
    initialFetchPlaylists();
  }, []);

  return (
    <div className="column is-5 is-hidden-touch">
      <table className="table column is-12 center-table is-hoverable">
        <thead>
          <tr>
            <th>name</th>
            <th>status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {currentInbox.map((track: InboxTrack) => (
            <InboxRow track={track} key={track.track_id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
