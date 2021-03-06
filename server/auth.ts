import * as express from "express";
import { SpotifyUserClient } from "../lib/spotify";
import { upsertUser } from "./data/users";
import { updateUserToken } from "./tasks/ingest";

const auth = express
  .Router()

  .get("/login", (req, res) => {
    res.redirect(SpotifyUserClient.authUrl());
  })

  .get("/callback", async (req, res) => {
    const token = await SpotifyUserClient.getToken(req.query.code);
    const api = new SpotifyUserClient(token);
    const userData = await api.me();
    const user = {
      token,
      ...userData
    };
    await upsertUser(user);
    req.session.user = user;
    res.redirect("/");
  })

  .get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
  })

  .get("/me", async (req, res) => {
    let { user } = req.session;
    if (user) {
      user = await updateUserToken(user);
      res.json(user);
    } else {
      res.status(204);
    }
  });

export default auth;
