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
const store_1 = require("../store");
const types_1 = require("../../types");
const playlistTypes = ["ignored", "curated", "inbox"];
function PlaylistRow({ playlist }) {
    const patchPlaylistType = store_1.useActions(actions => actions.playlists.patchPlaylistType);
    return (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null,
            react_1.default.createElement("img", { src: playlist.images.minBy("height").url, className: "playlist-cover" })),
        react_1.default.createElement("td", null, playlist.name),
        react_1.default.createElement("td", null,
            react_1.default.createElement("div", { className: "select" },
                react_1.default.createElement("select", { defaultValue: playlist.playlist_type, onChange: (e) => __awaiter(this, void 0, void 0, function* () {
                        yield patchPlaylistType({
                            id: playlist.id,
                            type: e.target.value
                        });
                    }) }, Object.values(types_1.PlaylistType).map((pt) => {
                    return (react_1.default.createElement("option", { key: pt, value: pt }, pt));
                }))))));
}
function Playlists() {
    const playlists = store_1.useStore(state => state.playlists.playlists);
    return (react_1.default.createElement("div", { className: "columns is-centered" },
        react_1.default.createElement("div", { className: "column is-narrow" },
            react_1.default.createElement("table", { className: "table center-table" },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null),
                        react_1.default.createElement("th", null, "Name"),
                        react_1.default.createElement("th", null, "Type"))),
                react_1.default.createElement("tbody", null, playlists.map(p => {
                    return react_1.default.createElement(PlaylistRow, { key: p.id, playlist: p });
                }))))));
}
exports.default = Playlists;
//# sourceMappingURL=Playlists.js.map