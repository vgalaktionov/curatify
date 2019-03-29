import axios from "axios";
import {
  UserModel,
  PlaybackModel,
  PlaylistsModel,
  StoreModel
} from "./storeTypes";
import {
  thunk,
  listen,
  select,
  createStore,
  createTypedHooks
} from "easy-peasy";

const userModel: UserModel = {
  me: null,
  ready: false,

  setUser(state, user) {
    state.me = user;
  },

  setReady(state, ready) {
    state.ready = ready;
  },

  getUser: thunk(async actions => {
    const { data: user } = await axios.get("/auth/me");
    if (user) {
      actions.setUser(user);
    }
  })
};

const playlistsModel: PlaylistsModel = {
  playlists: [],

  setPlaylists(state, playlists) {
    state.playlists = playlists;
  },
  setPlaylistType(state, { id, type }) {
    state.playlists = state.playlists.map(p => ({
      ...p,
      playlist_type: p.id === id ? type : p.playlist_type
    }));
  },

  patchPlaylistType: thunk(async (actions, { id, type }) => {
    await axios.patch(`/api/playlists/${id}/type`, {
      playlist_type: type
    });
    actions.setPlaylistType({
      id,
      type
    });
  }),

  listeners: listen(on => {
    on(
      userModel.setUser,
      thunk(async actions => {
        const { data: playlists } = await axios.get("/api/playlists");
        actions.setPlaylists(playlists);
      })
    );
  })
};

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
  currentTrack: select(
    ({
      playbackState: {
        track_window: { current_track: track }
      },
      inbox
    }) => {
      track.linked_from_uri = track.linked_from_uri || "";
      return {
        ...track,
        ...(inbox.find(t => {
          return [
            track.id,
            track.linked_from_uri.replace("spotify:track:", "")
          ].includes(t.track_id);
        }) || {})
      };
    }
  ),
  nowPlaying: select(state => state.playbackState.paused === false),

  setInbox(state, inbox) {
    state.inbox = inbox;
  },
  setPlaybackState(state, playbackState) {
    state.playbackState = playbackState || state.playbackState;
  },
  setTrackStatus(state, { trackId, status }) {
    state.inbox = state.inbox.map(t =>
      t.track_id === trackId
        ? {
            ...t,
            status
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

  listeners: listen(on => {
    on(
      userModel.setUser,
      thunk(async actions => {
        const { data: inbox } = await axios.get("/api/inbox");
        actions.setInbox(inbox);
      })
    );
  })
};

const store = createStore({
  // State
  user: userModel,
  playlists: playlistsModel,
  playback: playbackModel
});

const { useActions, useStore, useDispatch } = createTypedHooks<StoreModel>();

export { useActions, useDispatch, useStore };

export default store;
