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
const spotify_1 = require("../lib/spotify");
const users_1 = require("./data/users");
const ingest_1 = require("./tasks/ingest");
const auth = express.Router();
auth.get("/login", (req, res) => {
    res.redirect(spotify_1.SpotifyUserClient.authUrl());
});
auth.get("/callback", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const token = yield spotify_1.SpotifyUserClient.getToken(req.query.code);
    const api = new spotify_1.SpotifyUserClient(token);
    const userData = yield api.me();
    const user = Object.assign({ token }, userData);
    yield users_1.upsertUser(user);
    req.session.user = user;
    res.redirect("/");
}));
auth.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});
auth.get("/me", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { user } = req.session;
    if (user) {
        user = yield ingest_1.updateUserToken(user);
        res.json(user);
    }
    else {
        res.status(204);
    }
}));
exports.default = auth;
//# sourceMappingURL=auth.js.map