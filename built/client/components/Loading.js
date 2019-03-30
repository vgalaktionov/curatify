"use strict";
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
const React = __importStar(require("react"));
const playing_svg_1 = __importDefault(require("../static/playing.svg"));
function Loading() {
    return (React.createElement("section", { className: "section" },
        React.createElement("div", { className: "container" },
            React.createElement("div", { className: "columns is-desktop is-centered" },
                React.createElement("div", { className: "column is-narrow is-vcentered has-text-centered" },
                    React.createElement("img", { className: "preloader", src: playing_svg_1.default }),
                    React.createElement("br", null),
                    React.createElement("h3", { className: "is-size-3" }, "Finding awesome music for you..."))))));
}
exports.default = Loading;
//# sourceMappingURL=Loading.js.map