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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("./db"));
const pg_template_tag_1 = __importDefault(require("pg-template-tag"));
function upsertUser({ id, email, display_name: displayName, token }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.query(pg_template_tag_1.default `
    INSERT INTO users (id, email, display_name, token)
    VALUES (${id}, ${email}, ${displayName}, ${token}::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      token = EXCLUDED.token;
  `);
    });
}
exports.upsertUser = upsertUser;
function allUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db.query(pg_template_tag_1.default `SELECT * FROM users;`);
        return res.rows;
    });
}
exports.allUsers = allUsers;
//# sourceMappingURL=users.js.map