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
const InboxRow_1 = __importDefault(require("./InboxRow"));
function InboxList() {
    const inbox = store_1.useStore(store => store.playback.inbox);
    return (React.createElement("div", { className: "column is-5 is-hidden-touch" },
        React.createElement("table", { className: "table column is-12 center-table" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "name"),
                    React.createElement("th", null, "status"),
                    React.createElement("th", null))),
            React.createElement("tbody", null, inbox.slice(0, 9).map(track => (React.createElement(InboxRow_1.default, { track: track, key: track.track_id })))))));
}
exports.default = InboxList;
//# sourceMappingURL=Inbox.js.map