"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const playlists_1 = require("../data/playlists");
const inbox_1 = require("../data/inbox");
const users_1 = require("../data/users");
const util_1 = require("../../lib/util");
function analyzeAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const playlists = yield playlists_1.allPlaylists();
        yield Promise.all(playlists.map((p) => __awaiter(this, void 0, void 0, function* () {
            yield playlists_1.updatePlaylistArtistAffinities(p);
            yield playlists_1.updatePlaylistGenreAffinities(p);
        })));
        const users = yield users_1.allUsers();
        yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
            yield calculateTrackPlaylistMatches(user);
            console.info(`analyzed for user ${user.id}...`);
        })));
    });
}
exports.analyzeAll = analyzeAll;
function calculateTrackPlaylistMatches(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const playlists = yield playlists_1.userCuratedPlaylists(user.id);
        const unheard = yield inbox_1.userUnheardInbox(user);
        yield Promise.all(unheard.map((track) => __awaiter(this, void 0, void 0, function* () {
            const match = util_1.maxKey(playlists.reduce((acc, playlist) => {
                const genreScore = util_1.sum(Object.values(util_1.pick(playlist.genre_affinities || {}, track.genres)));
                const artistScore = util_1.sum(Object.values(util_1.pick(playlist.artist_affinities || {}, track.artists)));
                return Object.assign({ [playlist.id]: artistScore + genreScore }, acc);
            }, {}));
            yield inbox_1.updateTrackPlaylistMatches(match, track.track_id, user.id);
        })));
    });
}
//# sourceMappingURL=analyze.js.map