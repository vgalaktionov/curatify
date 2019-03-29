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
function updateUserInbox({ id }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    INSERT INTO inbox
    (user_id, track_id)
    SELECT p.user_id, pt.track_id
    FROM playlists_tracks pt
    INNER JOIN playlists p ON p.id = pt.playlist_id
    WHERE p.user_id = ${id}
    AND p.playlist_type = 'inbox'
    ON CONFLICT (user_id, track_id) DO NOTHING;
  `);
    });
}
exports.updateUserInbox = updateUserInbox;
function userUnheardInbox({ id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db.query(pg_template_tag_1.default `SELECT * FROM inbox WHERE user_id = ${id} AND status = 'unheard';`);
        return res.rows;
    });
}
exports.userUnheardInbox = userUnheardInbox;
function userUnheardInboxRich({ id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db.query(pg_template_tag_1.default `
    SELECT *, t.name FROM inbox i
      INNER JOIN tracks t ON t.id = i.track_id
    WHERE i.user_id = ${id}
    AND i.status = 'unheard';
  `);
        return res.rows;
    });
}
exports.userUnheardInboxRich = userUnheardInboxRich;
function enrichInbox() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    UPDATE inbox
    SET artists = temp.artists,
      genres = temp.genres,
      artist_names = temp.artist_names
    FROM (
      SELECT
        i.track_id,
        json_agg(artist_id) AS artists,
        json_agg(a.name) AS artist_names,
        json_array_elements(json_agg(a.genres)) AS genres
      FROM inbox i
      INNER JOIN artists_tracks at ON at.track_id = i.track_id
      INNER JOIN artists a ON a.id = AT.artist_id
      GROUP BY i.track_id
    ) AS temp
    WHERE inbox.track_id = temp.track_id;
  `);
    });
}
exports.enrichInbox = enrichInbox;
function updateTrackPlaylistMatches(playlistId, trackId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    UPDATE inbox SET
      playlist_matches = ${playlistId}
    WHERE track_id = ${trackId} AND user_id = ${userId};
  `);
    });
}
exports.updateTrackPlaylistMatches = updateTrackPlaylistMatches;
function updateTrackStatus(trackId, userId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    UPDATE inbox SET
      status = ${status}
    WHERE track_id = ${trackId} AND user_id = ${userId};
  `);
    });
}
exports.updateTrackStatus = updateTrackStatus;
//# sourceMappingURL=inbox.js.map