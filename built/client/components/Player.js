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
const CurrentlyPlaying_1 = __importDefault(require("./CurrentlyPlaying"));
const PlaybackButton_1 = __importDefault(require("./PlaybackButton"));
const types_1 = require("../../types");
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
    return (react_1.default.createElement("div", { className: "column player" },
        react_1.default.createElement("div", { className: "columns" },
            react_1.default.createElement(CurrentlyPlaying_1.default, { track: track })),
        react_1.default.createElement("div", { className: "columns" },
            react_1.default.createElement("div", { className: "column is-12 has-text-centered" },
                react_1.default.createElement("progress", { max: trackDuration, value: trackPosition, className: "progress" }))),
        react_1.default.createElement("div", { className: "columns playback-buttons is-vcentered has-text-centered" },
            react_1.default.createElement(PlaybackButton_1.default, { listener: dislikeTrack, iconName: "fa-heart-broken" }),
            react_1.default.createElement(PlaybackButton_1.default, { listener: previousTrack, iconName: "fa-step-backward" }),
            react_1.default.createElement(PlaybackButton_1.default, { listener: playOrPause, iconName: nowPlaying ? "fas fa-pause" : "fas fa-play", disabled: !playerReady }),
            react_1.default.createElement(PlaybackButton_1.default, { listener: nextTrack, iconName: "fa-step-forward" }),
            react_1.default.createElement(PlaybackButton_1.default, { listener: likeTrack, iconName: "fa-heart" }))));
}
exports.default = Player;
//# sourceMappingURL=Player.js.map