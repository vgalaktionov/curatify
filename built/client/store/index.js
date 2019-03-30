"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const easy_peasy_1 = require("easy-peasy");
const user_1 = __importDefault(require("./user"));
const playlists_1 = __importDefault(require("./playlists"));
const playback_1 = __importDefault(require("./playback"));
const store = easy_peasy_1.createStore({
    user: user_1.default,
    playlists: playlists_1.default,
    playback: playback_1.default
});
const { useActions, useStore, useDispatch } = easy_peasy_1.createTypedHooks();
exports.useActions = useActions;
exports.useStore = useStore;
exports.useDispatch = useDispatch;
exports.default = store;
//# sourceMappingURL=index.js.map