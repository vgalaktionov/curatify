import * as express from "express";
import { userPlaylists, updatePlaylistType } from "./data/playlists";
import { userUnheardInboxRich, updateTrackStatus } from "./data/inbox";
import { Status } from "../types";
import { ingestForUser } from "./tasks/ingest";
import { updateAffinities, calculateTrackPlaylistMatches } from "./tasks/analyze";

const api = express.Router();

api.get("/inbox", async (req, res) => {
  const inbox = await userUnheardInboxRich(req.session.user);
  res.json(inbox);
});

api.post("/inbox/refetch", async (req, res) => {
  ingestForUser(req.session.user)
    .then(updateAffinities)
    .then(() => calculateTrackPlaylistMatches(req.session.user));
  res.sendStatus(200);
});

api.get("/playlists", async (req, res) => {
  const playlists = await userPlaylists(req.session.user.id);
  res.json(playlists);
});

api.patch("/playlists/:id/type", async (req, res) => {
  await updatePlaylistType(req.params.id, req.body.playlist_type);
  res.sendStatus(200);
});

api.put("/tracks/:id/like", async (req, res) => {
  await updateTrackStatus(req.params.id, req.session.user.id, Status.Liked);
  res.sendStatus(200);
});

api.put("/tracks/:id/dislike", async (req, res) => {
  await updateTrackStatus(req.params.id, req.session.user.id, Status.Disliked);
  res.sendStatus(200);
});

export default api;
