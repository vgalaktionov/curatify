"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../lib/util"));
util_1.default();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookieSession = require("cookie-session");
const auth_1 = __importDefault(require("./auth"));
const api_1 = __importDefault(require("./api"));
const ingest_1 = require("./tasks/ingest");
const analyze_1 = require("./tasks/analyze");
const app = express_1.default();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(body_parser_1.default.json());
        app.use(cookieSession({
            maxAge: 24 * 60 * 60 * 1000,
            name: "session",
            keys: [process.env.SECRET]
        }));
        app.get("/login", (req, res) => {
            if (req.session.user) {
                res.redirect("/");
            }
            else {
                res.sendFile(path_1.default.resolve("dist/login.html"));
            }
        });
        app.use(express_1.default.static("dist"));
        app.use("/auth", auth_1.default);
        app.use("/api", api_1.default);
        // app.use((req, res) => {
        //   if (!req.path.includes("dist")) res.redirect("/");
        // });
        app.get("/*", (req, res) => {
            if (!req.session.user) {
                res.redirect("/login");
            }
            else {
                res.sendFile(path_1.default.resolve("dist/index.html"));
            }
        });
        app.listen(port);
        console.info(`Server listening on http://${host}:${port}`);
    });
}
function allTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        console.info("Running periodic tasks...");
        yield ingest_1.ingestAll();
        yield analyze_1.analyzeAll();
        console.info("Periodic tasks completed.");
    });
}
// Run the fetching tasks
setImmediate(allTasks);
setInterval(allTasks, 1000 * 60 * 5);
start();
//# sourceMappingURL=index.js.map