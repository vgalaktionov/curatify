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
/* global Spotify */
const store_1 = __importDefault(require("./store"));
function spotifyPlayer() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
            name: "Curatify Player",
            getOAuthToken: (cb) => {
                cb(store_1.default.getState().user.me.token.accessToken);
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
            store_1.default.dispatch.user.setReady(true);
        });
        // Not Ready
        player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
            store_1.default.dispatch.user.setReady(false);
        });
        /* eslint-enable camelcase */
        // Connect to the player!
        player.connect();
        window.player = player;
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const playbackState = yield player.getCurrentState();
            store_1.default.dispatch.playback.setPlaybackState(playbackState);
        }), 1000);
    };
}
exports.default = spotifyPlayer;
//# sourceMappingURL=spotifyPlayer.js.map