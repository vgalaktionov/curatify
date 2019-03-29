"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Inbox_1 = __importDefault(require("./Inbox"));
const Player_1 = __importDefault(require("./Player"));
function Curate() {
    return (react_1.default.createElement("div", { className: "columns" },
        react_1.default.createElement(Inbox_1.default, null),
        react_1.default.createElement("div", { className: "column is-1" }),
        react_1.default.createElement(Player_1.default, null)));
}
exports.default = Curate;
//# sourceMappingURL=Curate.js.map