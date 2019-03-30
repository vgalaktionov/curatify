import * as React from "react";
import { useStore } from "../store";
import InboxRow from "./InboxRow";

export default function InboxList() {
  const inbox = useStore(store => store.playback.inbox);
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
