import React from "react";
import InboxList from "./Inbox";
import Player from "./Player";

export default function Curate() {
  return (
    <div className="columns">
      <InboxList />
      <div className="column is-1" />
      <Player />
    </div>
  );
}
