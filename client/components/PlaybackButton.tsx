import React from "react";

import Icon from "./Icon";

interface PlaybackButtonProps {
  listener: () => Promise<void>;
  iconName: string;
  disabled?: boolean;
}

const PlaybackButton = ({ listener, iconName, disabled = false }: PlaybackButtonProps) => (
  <div className="column is-one-fifth">
    <button className="playback" onClick={listener} disabled={disabled}>
      <Icon icon={`fas ${iconName}`} size="is-large" />
    </button>
  </div>
);

export default PlaybackButton;
