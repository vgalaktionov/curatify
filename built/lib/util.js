"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function chunks(arr, chunkSize) {
    let chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
}
exports.chunks = chunks;
function uniqueBy(arr, prop) {
    return arr.filter((obj, pos) => {
        return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
exports.uniqueBy = uniqueBy;
function sum(arr) {
    return arr.reduce((acc, cur) => {
        return cur ? acc + cur : acc;
    }, 0);
}
exports.sum = sum;
function maxBy(arr, prop) {
    let max;
    arr.forEach((el) => {
        if (!max || el[prop] > max[prop]) {
            max = el;
        }
    });
    return max;
}
exports.maxBy = maxBy;
function minBy(arr, prop) {
    let min;
    arr.forEach((el) => {
        if (!min || el[prop] < min[prop]) {
            min = el;
        }
    });
    return min;
}
exports.minBy = minBy;
function pick(obj, keys) {
    const selected = {};
    keys.forEach(key => {
        selected[key] = obj[key];
    });
    return selected;
}
exports.pick = pick;
function maxKey(obj) {
    let maxKey;
    let maxValue = 0;
    Object.entries(obj).forEach(([k, v]) => {
        if (v > maxValue || maxValue === 0) {
            maxKey = k;
            maxValue = v;
        }
    });
    return maxKey;
}
exports.maxKey = maxKey;
//# sourceMappingURL=util.js.map