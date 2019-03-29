import * as React from "react";
import { useStore, useActions } from "../store";
import Icon from "./Icon";

import playing from "../static/playing.svg";
import { InboxTrack } from "../../types";

interface inboxRowProps {
  track: InboxTrack;
}

function InboxRow({ track }: inboxRowProps) {
  const nowPlaying = useStore(state => state.playback.nowPlaying);
  const currentTrack = useStore(state => state.playback.currentTrack);
  const thisTrack = currentTrack.id === track.track_id && nowPlaying;
  return (
    <tr key={track.track_id}>
      <td>{track.name}</td>
      <td>
        {track.status === "liked" && <Icon icon="fas fa-heart" />}
        {track.status === "disliked" && <Icon icon="fas fa-heart-broken" />}
      </td>
      <td>
        {thisTrack && (
          <span className="icon is-small">
            <img src={playing} className="play-spinner" />
          </span>
        )}
      </td>
    </tr>
  );
}

export default function InboxList() {
  const inbox = useStore(store => store.playback.inbox);
  return (
    <div>
      <h4 className="is-size-4">INBOX TRACKS</h4>
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
