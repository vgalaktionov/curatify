import React from "react";

import { InboxTrack } from "../../types";
import { useStore, useActions } from "../store";
import Icon from "./Icon";

import playing from "../static/playing.svg";
import { SpotifyUserClient } from "../../lib/spotify";

interface inboxRowProps {
  track: InboxTrack;
}

export default function InboxRow({ track }: inboxRowProps) {
  const inbox = useStore(state => state.playback.inbox);
  const setPaused = useActions(actions => actions.playback.setPaused);
  const currentTrack = useStore(state => state.playback.currentTrack);
  const thisTrack = currentTrack.id === track.track_id;
  const token = useStore(state => state.user.me.token, []);
  const spotify = new SpotifyUserClient(token);

  return (
    <tr
      key={track.track_id}
      onClick={async () => {
        let index = inbox.findIndex(t => track.track_id === t.track_id);
        index = index === -1 ? 0 : index;
        await spotify.play(
          inbox.slice(index + 1, index + 11).map(it => "spotify:track:" + it.track_id),
          window.player._options.id,
          0
        );
        setPaused(false);
      }}
      style={{ cursor: "pointer" }}
    >
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
