"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("./db"));
const pg_template_tag_1 = __importDefault(require("pg-template-tag"));
function upsertTracks(tracks) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    INSERT INTO tracks (id, name)
      VALUES ${db.values(tracks, "id", "name")}
    ON CONFLICT (id) DO NOTHING;
  `);
    });
}
exports.upsertTracks = upsertTracks;
function upsertPlaylistTracks(playlistTracks) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    INSERT INTO playlists_tracks (track_id, playlist_id)
      VALUES ${db.values(playlistTracks, "track_id", "playlist_id")}
    ON CONFLICT (track_id, playlist_id) DO NOTHING;
  `);
    });
}
exports.upsertPlaylistTracks = upsertPlaylistTracks;
function wipePlaylistTracks(playlistId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `DELETE FROM playlists_tracks WHERE playlist_id = ${playlistId};`);
    });
}
exports.wipePlaylistTracks = wipePlaylistTracks;
//# sourceMappingURL=tracks.js.map