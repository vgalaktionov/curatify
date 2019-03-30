import { select, thunk, Select, Action, Thunk } from "easy-peasy";
import axios from "axios";

import { Image, InboxTrack, Status } from "../../types";

export interface Album {
  images: Image[];
}

export interface TrackWindow {
  current_track: {
    id: string;
    linked_from_uri: string;
    album: Album;
  };
}

export interface PlaybackState {
  paused: boolean;
  duration: number;
  position: number;
  track_window: TrackWindow;
}

export interface PlaybackModel {
  playbackState: PlaybackState;
  inbox: InboxTrack[];

  currentTrack: Select<PlaybackModel>;
  nowPlaying: Select<PlaybackModel>;

  setInbox: Action<PlaybackModel, InboxTrack[]>;
  setPlaybackState: Action<PlaybackModel, PlaybackState | null>;
  setTrackStatus: Action<PlaybackModel, { trackId: string; status: Status; added?: boolean }>;
  setMatchingPlaylist: Action<PlaybackModel, { trackId: string; playlistId: string }>;
  setPaused: Action<PlaybackModel, boolean>;

  getInbox: Thunk<PlaybackModel>;
}

const playbackModel: PlaybackModel = {
  inbox: [],

  playbackState: {
    paused: true,
    duration: 0,
    position: 0,
    track_window: {
      current_track: {
        id: "",
        linked_from_uri: "",
        album: {
          images: [
            {
              url: "",
              height: 0
            }
          ]
        }
      }
    }
  },
  currentTrack: select(({ playbackState: { track_window: { current_track: track } }, inbox }) => {
    track.linked_from_uri = track.linked_from_uri || "";
    return {
      ...track,
      ...(inbox.find(t => {
        return [track.id, track.linked_from_uri.replace("spotify:track:", "")].includes(t.track_id);
      }) || {})
    };
  }),
  nowPlaying: select(state => state.playbackState.paused === false),

  setInbox(state, inbox) {
    state.inbox = inbox;
  },
  setPlaybackState(state, playbackState) {
    state.playbackState = playbackState || state.playbackState;
  },
  setTrackStatus(state, { trackId, status, added = false }) {
    state.inbox = state.inbox.map(t =>
      t.track_id === trackId
        ? {
            ...t,
            status,
            added
          }
        : t
    );
  },
  setMatchingPlaylist(state, { trackId, playlistId }) {
    state.inbox = state.inbox.map(t => {
      return t.track_id === trackId
        ? {
            ...t,
            playlist_matches: playlistId
          }
        : t;
    });
  },
  setPaused(state, paused) {
    state.playbackState.paused = false;
  },

  getInbox: thunk(async actions => {
    const { data: inbox } = await axios.get("/api/inbox");
    actions.setInbox(inbox);
  })
};

export default playbackModel;
