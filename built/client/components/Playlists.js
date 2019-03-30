"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const store_1 = require("../store");
const PlaylistRow_1 = __importDefault(require("./PlaylistRow"));
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
                    return react_1.default.createElement(PlaylistRow_1.default, { key: p.id, playlist: p });
                }))))));
}
exports.default = Playlists;
//# sourceMappingURL=Playlists.js.map