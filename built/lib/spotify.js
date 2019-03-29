"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const rax = require("retry-axios");
const querystring_1 = require("querystring");
const camelcaseKeys = require("camelcase-keys");
class SpotifyClient {
    constructor(token) {
        this.token = token;
        this.api = axios_1.default.create({
            baseURL: "https://api.spotify.com/v1",
            headers: { Authorization: `Bearer ${token.accessToken}` }
        });
        rax.attach(this.api);
    }
    static enrichToken(token) {
        const camelToken = camelcaseKeys(token);
        return Object.assign({ expiresAt: new Date().getTime() / 1000 + camelToken.expiresIn }, camelToken);
    }
    static getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.auth.post("/api/token", querystring_1.stringify({
                client_id: process.env.SPOTIFY_ID,
                grant_type: "client_credentials",
                client_secret: process.env.SPOTIFY_SECRET
            }));
            return this.enrichToken(data);
        });
    }
    artists(artistIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { artists } } = yield this.api.get("/artists", {
                params: { ids: artistIds.filter(id => !!id).join(",") }
            });
            return artists;
        });
    }
}
SpotifyClient.authBase = "https://accounts.spotify.com";
SpotifyClient.auth = axios_1.default.create({ baseURL: SpotifyClient.authBase });
SpotifyClient.scope = [
    "user-read-email",
    "user-library-read",
    "user-library-modify",
    "streaming",
    "user-read-birthdate",
    "user-read-private",
    "user-modify-playback-state",
    "playlist-modify-private",
    "playlist-modify-public"
].join(" ");
exports.SpotifyClient = SpotifyClient;
class SpotifyUserClient extends SpotifyClient {
    static authUrl() {
        return `${SpotifyUserClient.authBase}/authorize?${querystring_1.stringify({
            scope: SpotifyUserClient.scope,
            client_id: process.env.SPOTIFY_ID,
            redirect_uri: process.env.CALLBACK_URL,
            response_type: "code"
        })}`;
    }
    static getToken(code) {
        const _super = Object.create(null, {
            enrichToken: { get: () => super.enrichToken }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield SpotifyUserClient.auth.post("/api/token", querystring_1.stringify({
                client_id: process.env.SPOTIFY_ID,
                redirect_uri: process.env.CALLBACK_URL,
                grant_type: "authorization_code",
                client_secret: process.env.SPOTIFY_SECRET,
                code
            }));
            return _super.enrichToken.call(this, data);
        });
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield SpotifyUserClient.auth.post("/api/token", querystring_1.stringify({
                client_id: process.env.SPOTIFY_ID,
                grant_type: "refresh_token",
                client_secret: process.env.SPOTIFY_SECRET,
                refresh_token: this.token.refreshToken
            }));
            return SpotifyClient.enrichToken(Object.assign({}, this.token, data));
        });
    }
    me() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.api.get("/me");
            return data;
        });
    }
    mePlaylists() {
        return __asyncGenerator(this, arguments, function* mePlaylists_1() {
            let next = "/me/playlists";
            while (next) {
                const { data } = yield __await(this.api.get(next));
                next = data.next;
                yield yield __await(data.items);
            }
        });
    }
    playlistTracks(playlistId) {
        return __asyncGenerator(this, arguments, function* playlistTracks_1() {
            let next = `/playlists/${playlistId}/tracks`;
            while (next) {
                const { data } = yield __await(this.api.get(next, { params: { limit: 100 } }));
                next = data.next;
                yield yield __await(data.items);
            }
        });
    }
    play(uris, deviceId, position_ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.api.put(`/me/player/play?device_id=${deviceId}`, {
                uris,
                position_ms
            });
        });
    }
    pause(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.api.put(`/me/player/pause?device_id=${deviceId}`);
        });
    }
    addTrackToPlaylist(trackId, playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.api.post(`/playlists/${playlistId}/tracks`, {
                uris: [`spotify:track:${trackId}`]
            });
        });
    }
}
exports.SpotifyUserClient = SpotifyUserClient;
//# sourceMappingURL=spotify.js.map