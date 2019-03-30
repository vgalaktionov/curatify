import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cookieSession = require("cookie-session");

import auth from "./auth";
import api from "./api";
import { ingestAll } from "./tasks/ingest";
import { analyzeAll } from "./tasks/analyze";

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

async function start() {
  app.use(bodyParser.json());
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      name: "session",
      keys: [process.env.SECRET]
    })
  );

  app.get("/login", (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.sendFile(path.resolve("dist/login.html"));
    }
  });
  app.use(express.static("dist"));
  app.use("/auth", auth);
  app.use("/api", api);
  // app.use((req, res) => {
  //   if (!req.path.includes("dist")) res.redirect("/");
  // });
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
  console.info("Periodic tasks completed.");
}

// Run the fetching tasks
setImmediate(allTasks);
setInterval(allTasks, 1000 * 60 * 5);

start();
