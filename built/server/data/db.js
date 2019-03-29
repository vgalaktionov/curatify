"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pg_template_tag_1 = __importStar(require("pg-template-tag"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
function query(text, params) {
    return pool.query(text, params);
}
exports.query = query;
function values(objects, ...vals) {
    return pg_template_tag_1.join(objects.map(obj => {
        const valueSet = pg_template_tag_1.join(vals.map((val) => {
            switch (typeof val) {
                case "object":
                    const { key, def = null, json = false } = val;
                    let data = obj[key] || def;
                    if (json) {
                        data = JSON.stringify(data);
                    }
                    return pg_template_tag_1.default `${data}`;
                case "string":
                    return pg_template_tag_1.default `${obj[val]}`;
                default:
                    throw new Error("Vals should be either strings describing an object path, or objects.");
            }
        }));
        return pg_template_tag_1.default `(${valueSet})`;
    }), ", ");
}
exports.values = values;
//# sourceMappingURL=db.js.map