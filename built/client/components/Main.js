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
const react_router_dom_1 = require("react-router-dom");
const Navbar_1 = __importDefault(require("./Navbar"));
const Curate_1 = __importDefault(require("./Curate"));
const Playlists_1 = __importDefault(require("./Playlists"));
function Main() {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(React.Fragment, null,
            React.createElement(Navbar_1.default, null),
            React.createElement("section", { className: "section" },
                React.createElement("div", { className: "container" },
                    React.createElement(react_router_dom_1.Switch, null,
                        React.createElement(react_router_dom_1.Redirect, { exact: true, from: "/", to: "/curate" }),
                        React.createElement(react_router_dom_1.Route, { path: "/curate", component: Curate_1.default }),
                        React.createElement(react_router_dom_1.Route, { path: "/playlists", component: Playlists_1.default })))))));
}
exports.default = Main;
//# sourceMappingURL=Main.js.map