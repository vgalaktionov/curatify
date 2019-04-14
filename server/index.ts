import dotenv from "dotenv";
dotenv.config();

import { ingestAll } from "./tasks/ingest";
import { analyzeAll } from "./tasks/analyze";
import log from "./logger";
import app from "./server";

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

app.listen(port);

log.info(`Server listening on http://${host}:${port}`);
