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
function upsertPlaylists(playlists) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `INSERT INTO playlists (id, user_id, name, images)
      VALUES ${db.values(playlists, "id", "user_id", "name", {
            key: "images",
            json: true
        })}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      images =  EXCLUDED.images;`);
    });
}
exports.upsertPlaylists = upsertPlaylists;
function userPlaylists(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db.query(pg_template_tag_1.default `SELECT * FROM playlists WHERE user_id = ${userId};`);
        return res.rows;
    });
}
exports.userPlaylists = userPlaylists;
function userCuratedPlaylists(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db.query(pg_template_tag_1.default `SELECT * FROM playlists WHERE user_id = ${userId} AND playlist_type = 'curated';`);
        return res.rows;
    });
}
exports.userCuratedPlaylists = userCuratedPlaylists;
function allPlaylists() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db.query(pg_template_tag_1.default `SELECT * FROM playlists;`);
        return res.rows;
    });
}
exports.allPlaylists = allPlaylists;
function updatePlaylistArtistAffinities({ id }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    WITH aff AS (
      SELECT jsonb_object_agg(temp.artist_id, temp.count) as aff
      FROM (
        SELECT
          art.artist_id,
          count(art.track_id) /
            (SELECT count(*) FROM playlists_tracks WHERE playlist_id = ${id})::numeric AS count
        FROM artists a
          INNER JOIN artists_tracks art ON art.artist_id = a.id
          INNER JOIN playlists_tracks pt ON pt.track_id = art.track_id
          INNER JOIN playlists p ON pt.playlist_id = p.id
        WHERE p.id = ${id}
        GROUP BY a.name, art.artist_id
      ) AS temp
    )
    UPDATE playlists SET artist_affinities = aff.aff FROM aff WHERE playlists.id = ${id};
  `);
    });
}
exports.updatePlaylistArtistAffinities = updatePlaylistArtistAffinities;
function updatePlaylistGenreAffinities({ id }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    WITH aff AS (
      SELECT jsonb_object_agg(agg.genre, agg.count) AS aff
      FROM (
        SELECT
          genre, count(*) /
            (SELECT count(*) FROM playlists_tracks WHERE playlist_id = ${id})::numeric AS count
        FROM (
          SELECT jsonb_array_elements_text(a.genres) AS genre FROM artists a
            INNER JOIN artists_tracks art ON art.artist_id = a.id
            INNER JOIN playlists_tracks pt ON pt.track_id = art.track_id
            INNER JOIN playlists p ON pt.playlist_id = p.id
          WHERE p.id = ${id}
        ) AS temp
        GROUP BY temp.genre
      ) AS agg)
    UPDATE playlists SET genre_affinities = aff.aff FROM aff WHERE playlists.id = ${id};
  `);
    });
}
exports.updatePlaylistGenreAffinities = updatePlaylistGenreAffinities;
function updatePlaylistType(id, type) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `update playlists set playlist_type = ${type} where id = ${id};`);
    });
}
exports.updatePlaylistType = updatePlaylistType;
//# sourceMappingURL=playlists.js.map