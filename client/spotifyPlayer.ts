import { PlaybackState } from "./store/storeTypes";
/* global Spotify */
import store from "./store";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: Function;
    Spotify: Spotify;
    player: PlayerInstance;
  }
}

interface Spotify {
  Player: Player;
}

interface Player {
  new (obj: object): PlayerInstance;
}

interface PlayerInstance {
  _options: {
    id: string;
  };

  addListener(signal: string, fn: (sp: SignalPayload) => void): void;
  connect(): void;
  getCurrentState(): Promise<PlaybackState>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
}

interface SignalPayload {
  message: string;
  device_id: string;
}

export default function spotifyPlayer() {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new window.Spotify.Player({
      name: "Curatify Player",
      getOAuthToken: (cb: Function) => {
        cb(store.getState().user.me.token.accessToken);
      }
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", state => {
      console.log(state);
    });

    // Ready
    /* eslint-disable camelcase */
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      store.dispatch.user.setReady(true);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
      store.dispatch.user.setReady(false);
    });
    /* eslint-enable camelcase */

    // Connect to the player!
    player.connect();
    window.player = player;

    setInterval(async () => {
      const playbackState = await player.getCurrentState();
      store.dispatch.playback.setPlaybackState(playbackState);
    }, 1000);
  };
}
