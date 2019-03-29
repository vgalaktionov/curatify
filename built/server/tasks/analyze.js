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
            const match = Object.max(playlists.reduce((acc, playlist) => {
                const genreScore = Object.values(Object.pick(playlist.genre_affinities, track.genres)).sum();
                const artistScore = Object.values(Object.pick(playlist.artist_affinities, track.artists)).sum();
                return Object.assign({ [playlist.id]: artistScore + genreScore }, acc);
            }, {}));
            yield inbox_1.updateTrackPlaylistMatches(match, track.track_id, user.id);
        })));
    });
}
//# sourceMappingURL=analyze.js.map