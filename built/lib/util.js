"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extend() {
    Object.defineProperty(Array.prototype, "chunks", {
        value(chunkSize) {
            let chunks = [];
            for (let i = 0; i < this.length; i += chunkSize)
                chunks.push(this.slice(i, i + chunkSize));
            return chunks;
        }
    });
    Object.defineProperty(Array.prototype, "uniqueBy", {
        value(prop) {
            return this.filter((obj, pos) => {
                return this.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
            });
        }
    });
    Object.defineProperty(Array.prototype, "sum", {
        value() {
            return this.reduce((acc, cur) => {
                return acc + cur;
            }, 0);
        }
    });
    Object.defineProperty(Array.prototype, "maxBy", {
        value(prop) {
            let max;
            this.forEach((el) => {
                if (!max || el[prop] > max[prop]) {
                    max = el;
                }
            });
            return max;
        }
    });
    Object.defineProperty(Array.prototype, "minBy", {
        value(prop) {
            let min;
            this.forEach((el) => {
                if (!min || el[prop] < min[prop]) {
                    min = el;
                }
            });
            return min;
        }
    });
    Object.defineProperty(Object, "pick", {
        value(obj, keys) {
            const selected = {};
            keys.forEach(key => {
                selected[key] = obj[key];
            });
            return selected;
        }
    });
    Object.defineProperty(Object, "max", {
        value(obj) {
            let maxKey;
            let maxValue = 0;
            Object.entries(obj).forEach(([k, v]) => {
                if (v > maxValue) {
                    maxKey = k;
                    maxValue = v;
                }
            });
            return maxKey;
        }
    });
}
exports.default = extend;
//# sourceMappingURL=util.js.map