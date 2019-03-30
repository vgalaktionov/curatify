import * as React from "react";
import { useStore, useActions } from "../store";
import InboxRow from "./InboxRow";
import { useEffect } from "react";

export default function InboxList() {
  const inbox = useStore(store => store.playback.inbox);
  const initialFetchInbox = useActions(actions => actions.playback.getInbox);
  const initialFetchPlaylists = useActions(actions => actions.playlists.getPlaylists);
  useEffect(() => {
    if (!inbox.length) initialFetchInbox();
    initialFetchPlaylists();
  }, []);
  return (
    <div className="column is-5 is-hidden-touch">
      <table className="table column is-12 center-table">
        <thead>
          <tr>
            <th>name</th>
            <th>status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {inbox.slice(0, 9).map(track => (
            <InboxRow track={track} key={track.track_id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
