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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const playlists_1 = require("./data/playlists");
const inbox_1 = require("./data/inbox");
const types_1 = require("../types");
const api = express.Router();
api.get("/inbox", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const inbox = yield inbox_1.userUnheardInboxRich(req.session.user);
    res.json(inbox);
}));
api.get("/playlists", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const playlists = yield playlists_1.userPlaylists(req.session.user.id);
    res.json(playlists);
}));
api.patch("/playlists/:id/type", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield playlists_1.updatePlaylistType(req.params.id, req.body.playlist_type);
    res.sendStatus(200);
}));
api.put("/tracks/:id/like", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield inbox_1.updateTrackStatus(req.params.id, req.session.user.id, types_1.Status.Liked);
    res.sendStatus(200);
}));
api.put("/tracks/:id/dislike", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield inbox_1.updateTrackStatus(req.params.id, req.session.user.id, types_1.Status.Disliked);
    res.sendStatus(200);
}));
exports.default = api;
//# sourceMappingURL=api.js.map