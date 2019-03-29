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
function upsertArtists(artists) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    INSERT INTO artists (id, name, genres, images)
      VALUES ${db.values(artists, "id", "name", { key: "genres", def: [], json: true }, { key: "images", def: [], json: true })}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      genres = EXCLUDED.genres,
      images = EXCLUDED.images;
  `);
    });
}
exports.upsertArtists = upsertArtists;
function upsertArtistTracks(artistTracks) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    INSERT INTO artists_tracks (track_id, artist_id)
      VALUES ${db.values(artistTracks, "track_id", "artist_id")}
    ON CONFLICT (track_id, artist_id) DO NOTHING;
  `);
    });
}
exports.upsertArtistTracks = upsertArtistTracks;
function allIds() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db.query(pg_template_tag_1.default `SELECT id FROM artists;`);
        return res.rows.map(r => r.id);
    });
}
exports.allIds = allIds;
//# sourceMappingURL=artists.js.map