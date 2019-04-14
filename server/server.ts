import express = require("express");
import bodyParser = require("body-parser");
import cookieSession = require("cookie-session");
import expressWinston from "express-winston";
import path from "path";

import log from "./logger";
import auth from "./auth";
import api from "./api";

const app = express()
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
  .use("/auth", auth)
  .use("/api", api)
  .get("/", (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      res.sendFile(path.resolve("dist/index.html"));
    }
  })
  .use(express.static("dist"));

export default app;
