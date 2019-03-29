"use strict";
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
const React = __importStar(require("react"));
const store_1 = require("../store");
const Icon_1 = __importDefault(require("./Icon"));
const playing_svg_1 = __importDefault(require("../static/playing.svg"));
function InboxRow({ track }) {
    const nowPlaying = store_1.useStore(state => state.playback.nowPlaying);
    const currentTrack = store_1.useStore(state => state.playback.currentTrack);
    const thisTrack = currentTrack.id === track.track_id && nowPlaying;
    return (React.createElement("tr", { key: track.track_id },
        React.createElement("td", null, track.name),
        React.createElement("td", null,
            track.status === "liked" && React.createElement(Icon_1.default, { icon: "fas fa-heart" }),
            track.status === "disliked" && React.createElement(Icon_1.default, { icon: "fas fa-heart-broken" })),
        React.createElement("td", null, thisTrack && (React.createElement("span", { className: "icon is-small" },
            React.createElement("img", { src: playing_svg_1.default, className: "play-spinner" }))))));
}
function InboxList() {
    const inbox = store_1.useStore(store => store.playback.inbox);
    return (React.createElement("div", null,
        React.createElement("h4", { className: "is-size-4" }, "INBOX TRACKS"),
        React.createElement("table", { className: "table column is-12 center-table" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "name"),
                    React.createElement("th", null, "status"),
                    React.createElement("th", null))),
            React.createElement("tbody", null, inbox.slice(0, 9).map(track => (React.createElement(InboxRow, { track: track, key: track.track_id })))))));
}
exports.default = InboxList;
//# sourceMappingURL=Inbox.js.map