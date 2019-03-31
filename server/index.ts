import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cookieSession = require("cookie-session");
import expressWinston from "express-winston";

import auth from "./auth";
import api from "./api";
import { ingestAll } from "./tasks/ingest";
import { analyzeAll } from "./tasks/analyze";
import log from "./logger";

async function allTasks() {
  log.info("Running periodic tasks...");
  try {
    await ingestAll();
    await analyzeAll();
  } catch (error) {
    log.error(error);
  }
  log.info("Periodic tasks completed.");
}

// Run the fetching tasks
setImmediate(allTasks);
setInterval(allTasks, 1000 * 60 * 5);

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

express()
  .use(bodyParser.json())
  .use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      name: "session",
      keys: [process.env.SECRET]
    })
  )
  .use(expressWinston.logger({ winstonInstance: log, expressFormat: true }))
  .get("/login", (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.sendFile(path.resolve("dist/login.html"));
    }
  })
  .use(express.static("dist"))
  .use("/auth", auth)
  .use("/api", api)
  .get("/*", (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      res.sendFile(path.resolve("dist/index.html"));
    }
  })
  .listen(port);

log.info(`Server listening on http://${host}:${port}`);
