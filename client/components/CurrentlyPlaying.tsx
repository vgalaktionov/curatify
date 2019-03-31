import React from "react";

import { InboxTrack, Image } from "../../types";
import SelectMatchingPlaylist from "./SelectMatchingPlaylist";
import { maxBy } from "../../lib/util";

interface RichInboxTrack extends InboxTrack {
  album: {
    images: Image[];
  };
}

interface CurrentlyPlayingProps {
  track: RichInboxTrack;
}

export default function CurrentlyPlaying({ track }: CurrentlyPlayingProps) {
  const imageUrl = maxBy(track.album.images, "height").url;

  return (
    <div className="column is-12 has-text-centered currently-playing">
      <img src={imageUrl} style={{ height: "280px" }} />
      <h5 className="is-size-5 has-text-weight-semibold track-name">{track.name}</h5>
      {track.artists && (
        <p className="has-text-weight-semibold">{track.artist_names.join(", ")} </p>
      )}
      {track.track_id && <SelectMatchingPlaylist track={track} />}
    </div>
  );
}
