import extend from "../lib/util";
extend();

import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import cookieSession from "cookie-session";

import auth from "./auth";
import api from "./api";
import { ingestAll } from "./tasks/ingest";
import { analyzeAll } from "./tasks/analyze";

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

app.set("port", port);

async function start() {
  app.use(bodyParser.json());
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      name: "session",
      secret: process.env.SECRET
    })
  );

  app.use(express.static("dist"));
  app.use("/auth", auth);
  app.use("/api", api);
  app.get("/login", (req, res) => {
    res.sendFile(path.resolve("dist/login.html"));
  });
  app.get("/*", (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      res.sendFile(path.resolve("dist/index.html"));
    }
  });
  app.listen(port);
  console.info(`Server listening on http://${host}:${port}`);
}

async function allTasks() {
  console.info("Running periodic tasks...");
  await ingestAll();
  await analyzeAll();
}

// Run the fetching tasks
setImmediate(allTasks);
setInterval(allTasks, 1000 * 60 * 5);

start();
