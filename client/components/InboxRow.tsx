import React from "react";

import { InboxTrack } from "../../types";
import { useStore } from "../store";
import Icon from "./Icon";

import playing from "../static/playing.svg";

interface inboxRowProps {
  track: InboxTrack;
}

export default function InboxRow({ track }: inboxRowProps) {
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
