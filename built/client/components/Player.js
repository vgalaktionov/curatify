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
const react_1 = __importDefault(require("react"));
const axios_1 = __importDefault(require("axios"));
const store_1 = require("../store");
const spotify_1 = require("../../lib/spotify");
const Icon_1 = __importDefault(require("./Icon"));
const types_1 = require("../../types");
function CurrentlyPlaying({ track }) {
    const imageUrl = track.album.images.maxBy("height").url;
    const playlists = store_1.useStore(state => state.playlists.playlists);
    const matchingPlaylist = playlists.find(p => p.id === track.playlist_matches);
    const setMatchingPlaylist = store_1.useActions(actions => actions.playback.setMatchingPlaylist);
    return (react_1.default.createElement("div", { className: "column is-12 has-text-centered currently-playing" },
        react_1.default.createElement("img", { src: imageUrl }),
        react_1.default.createElement("h5", { className: "is-size-5 has-text-weight-semibold" }, track.name),
        track.artists && (react_1.default.createElement("p", { className: "has-text-weight-semibold" },
            track.artist_names.join(", "),
            " ")),
        track.track_id && (react_1.default.createElement("div", { className: "field" },
            react_1.default.createElement("label", { htmlFor: "matches", className: "is-small" },
                "matches:",
                react_1.default.createElement("div", { className: "control is-centered has-text-centered" },
                    react_1.default.createElement("span", { className: "select" },
                        react_1.default.createElement("select", { name: "matches", className: "is-small", defaultValue: matchingPlaylist.id, onChange: (e) => __awaiter(this, void 0, void 0, function* () {
                                yield setMatchingPlaylist({
                                    trackId: track.track_id,
                                    playlistId: e.target.value
                                });
                            }) }, playlists.map(playlist => {
                            return (react_1.default.createElement("option", { key: playlist.id, value: playlist.id }, playlist.name));
                        })))))))));
}
function Player() {
    const track = store_1.useStore(state => state.playback.currentTrack);
    const { duration: trackDuration, position: trackPosition } = store_1.useStore(state => state.playback.playbackState);
    const playerReady = store_1.useStore(state => state.user.ready);
    const inbox = store_1.useStore(state => state.playback.inbox);
    const setPaused = store_1.useActions(actions => actions.playback.setPaused);
    const nowPlaying = store_1.useStore(state => state.playback.nowPlaying);
    const setTrackStatus = store_1.useActions(actions => actions.playback.setTrackStatus);
    const token = store_1.useStore(state => state.user.me.token, []);
    const spotify = new spotify_1.SpotifyUserClient(token);
    const likeTrack = () => __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.put(`/api/tracks/${track.id}/like`);
        yield spotify.addTrackToPlaylist(track.id, track.playlist_matches);
        setTrackStatus({ trackId: track.id, status: types_1.Status.Liked });
    });
    const dislikeTrack = () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.put(`/api/tracks/${track.id}/dislike`);
        yield nextTrack();
        setTrackStatus({ trackId: track.id, status: types_1.Status.Disliked });
    });
    const nextTrack = () => __awaiter(this, void 0, void 0, function* () {
        yield window.player.nextTrack();
    });
    const previousTrack = () => __awaiter(this, void 0, void 0, function* () {
        yield window.player.previousTrack();
    });
    const playOrPause = () => __awaiter(this, void 0, void 0, function* () {
        if (nowPlaying) {
            yield spotify.pause(window.player._options.id);
            setPaused(true);
        }
        else {
            yield spotify.play(inbox.slice(0, 11).map(it => "spotify:track:" + it.track_id), window.player._options.id);
            setPaused(false);
        }
    });
    return (react_1.default.createElement("div", { className: "column is-6 player" },
        react_1.default.createElement("div", { className: "columns" },
            react_1.default.createElement(CurrentlyPlaying, { track: track })),
        react_1.default.createElement("div", { className: "columns" },
            react_1.default.createElement("div", { className: "column is-12 has-text-centered" },
                react_1.default.createElement("progress", { max: trackDuration, value: trackPosition, className: "progress" }))),
        react_1.default.createElement("div", { className: "columns playback-buttons is-vcentered has-text-centered" },
            react_1.default.createElement("div", { className: "column is-one-fifth" },
                react_1.default.createElement("button", { className: "playback", onClick: dislikeTrack },
                    react_1.default.createElement(Icon_1.default, { icon: "fas fa-heart-broken", size: "is-large" }))),
            react_1.default.createElement("div", { className: "column is-one-fifth" },
                react_1.default.createElement("button", { className: "playback", onClick: previousTrack },
                    react_1.default.createElement(Icon_1.default, { icon: "fas fa-step-backward", size: "is-large" }))),
            react_1.default.createElement("div", { className: "column is-one-fifth" },
                react_1.default.createElement("button", { disabled: !playerReady, className: "playback", onClick: playOrPause },
                    react_1.default.createElement(Icon_1.default, { icon: nowPlaying ? "fas fa-pause" : "fas fa-play", size: "is-large" }))),
            react_1.default.createElement("div", { className: "column is-one-fifth" },
                react_1.default.createElement("button", { className: "playback", onClick: nextTrack },
                    react_1.default.createElement(Icon_1.default, { icon: "fas fa-step-forward", size: "is-large" }))),
            react_1.default.createElement("div", { className: "column is-one-fifth" },
                react_1.default.createElement("button", { className: "playback", onClick: likeTrack },
                    react_1.default.createElement(Icon_1.default, { icon: "fas fa-heart", size: "is-large" }))))));
}
exports.default = Player;
//# sourceMappingURL=Player.js.map