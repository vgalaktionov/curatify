"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const spotify_1 = require("../../lib/spotify");
const users_1 = require("../data/users");
const playlists_1 = require("../data/playlists");
const tracks_1 = require("../data/tracks");
const artists_1 = require("../data/artists");
const inbox_1 = require("../data/inbox");
function expiring({ expiresAt }) {
    return Date.now() / 1000 > expiresAt - 60;
}
function updateUserToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (expiring(user.token)) {
            const client = new spotify_1.SpotifyUserClient(user.token);
            user.token = yield client.refreshToken();
            yield users_1.upsertUser(user);
        }
        return user;
    });
}
exports.updateUserToken = updateUserToken;
function ingestUserPlaylists(client, user) {
    return __awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        try {
            for (var _b = __asyncValues(client.mePlaylists()), _c; _c = yield _b.next(), !_c.done;) {
                const page = _c.value;
                yield playlists_1.upsertPlaylists(page.map(({ id, name, images }) => ({
                    id,
                    user_id: user.id,
                    name,
                    images
                })));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function ingestUserPlaylistTracks(client, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const playlists = yield playlists_1.userPlaylists(user.id);
        yield Promise.all(playlists.map((playlist) => __awaiter(this, void 0, void 0, function* () {
            var e_2, _a;
            let tracks = [];
            try {
                for (var _b = __asyncValues(client.playlistTracks(playlist.id)), _c; _c = yield _b.next(), !_c.done;) {
                    const page = _c.value;
                    tracks.push(...page.map(t => t.track));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            tracks = tracks
                .filter(t => t !== null)
                .filter(t => !!t.id)
                .uniqueBy("id");
            yield tracks_1.upsertTracks(tracks.map(track => ({
                id: track.id,
                name: track.name
            })));
            yield tracks_1.wipePlaylistTracks(playlist.id);
            yield tracks_1.upsertPlaylistTracks(tracks.map(t => ({
                track_id: t.id,
                playlist_id: playlist.id
            })));
            yield ingestTrackArtists(tracks);
        })));
    });
}
function ingestTrackArtists(tracks) {
    return __awaiter(this, void 0, void 0, function* () {
        yield artists_1.upsertArtists(tracks
            .map(t => t.artists)
            .flat()
            .filter(a => !!a.id)
            .uniqueBy("id")
            .map(({ id, name }) => ({ id, name })));
        yield artists_1.upsertArtistTracks(tracks
            .map(track => track.artists.map(({ id }) => ({
            artist_id: id,
            track_id: track.id
        })))
            .flat());
    });
}
function ingestForUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info(`ingesting for user ${user.id}...`);
        user = yield updateUserToken(user);
        const client = new spotify_1.SpotifyUserClient(user.token);
        yield ingestUserPlaylists(client, user);
        console.info(`ingested playlists for user ${user.id}...`);
        yield ingestUserPlaylistTracks(client, user);
        console.info(`ingested playlist tracks for user ${user.id}...`);
        yield inbox_1.updateUserInbox(user);
        console.info(`updated inbox for user ${user.id}...`);
    });
}
function ingestArtistDetails(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const ids = yield artists_1.allIds();
        yield Promise.all(ids.chunks(50).map((chunk) => __awaiter(this, void 0, void 0, function* () {
            const artists = yield client.artists(chunk);
            yield artists_1.upsertArtists(artists.map(a => Object.pick(a, ["id", "name", "genres", "images"])));
        })));
    });
}
function ingestAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield users_1.allUsers();
            yield Promise.all(users.map((u) => __awaiter(this, void 0, void 0, function* () { return ingestForUser(u); })));
            const token = yield spotify_1.SpotifyClient.getToken();
            const genericClient = new spotify_1.SpotifyClient(token);
            yield ingestArtistDetails(genericClient);
            yield inbox_1.enrichInbox();
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.ingestAll = ingestAll;
//# sourceMappingURL=ingest.js.map