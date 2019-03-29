"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const easy_peasy_1 = require("easy-peasy");
const userModel = {
    me: null,
    ready: false,
    setUser(state, user) {
        state.me = user;
    },
    setReady(state, ready) {
        state.ready = ready;
    },
    getUser: easy_peasy_1.thunk((actions) => __awaiter(this, void 0, void 0, function* () {
        const { data: user } = yield axios_1.default.get("/auth/me");
        if (user) {
            actions.setUser(user);
        }
    }))
};
const playlistsModel = {
    playlists: [],
    setPlaylists(state, playlists) {
        state.playlists = playlists;
    },
    setPlaylistType(state, { id, type }) {
        state.playlists = state.playlists.map(p => (Object.assign({}, p, { playlist_type: p.id === id ? type : p.playlist_type })));
    },
    patchPlaylistType: easy_peasy_1.thunk((actions, { id, type }) => __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.patch(`/api/playlists/${id}/type`, {
            playlist_type: type
        });
        actions.setPlaylistType({
            id,
            type
        });
    })),
    listeners: easy_peasy_1.listen(on => {
        on(userModel.setUser, easy_peasy_1.thunk((actions) => __awaiter(this, void 0, void 0, function* () {
            const { data: playlists } = yield axios_1.default.get("/api/playlists");
            actions.setPlaylists(playlists);
        })));
    })
};
const playbackModel = {
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
    currentTrack: easy_peasy_1.select(({ playbackState: { track_window: { current_track: track } }, inbox }) => {
        track.linked_from_uri = track.linked_from_uri || "";
        return Object.assign({}, track, (inbox.find(t => {
            return [
                track.id,
                track.linked_from_uri.replace("spotify:track:", "")
            ].includes(t.track_id);
        }) || {}));
    }),
    nowPlaying: easy_peasy_1.select(state => state.playbackState.paused === false),
    setInbox(state, inbox) {
        state.inbox = inbox;
    },
    setPlaybackState(state, playbackState) {
        state.playbackState = playbackState || state.playbackState;
    },
    setTrackStatus(state, { trackId, status }) {
        state.inbox = state.inbox.map(t => t.track_id === trackId
            ? Object.assign({}, t, { status }) : t);
    },
    setMatchingPlaylist(state, { trackId, playlistId }) {
        state.inbox = state.inbox.map(t => {
            return t.track_id === trackId
                ? Object.assign({}, t, { playlist_matches: playlistId }) : t;
        });
    },
    setPaused(state, paused) {
        state.playbackState.paused = false;
    },
    listeners: easy_peasy_1.listen(on => {
        on(userModel.setUser, easy_peasy_1.thunk((actions) => __awaiter(this, void 0, void 0, function* () {
            const { data: inbox } = yield axios_1.default.get("/api/inbox");
            actions.setInbox(inbox);
        })));
    })
};
const store = easy_peasy_1.createStore({
    // State
    user: userModel,
    playlists: playlistsModel,
    playback: playbackModel
});
const { useActions, useStore, useDispatch } = easy_peasy_1.createTypedHooks();
exports.useActions = useActions;
exports.useStore = useStore;
exports.useDispatch = useDispatch;
exports.default = store;
//# sourceMappingURL=index.js.map