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
const Curate_1 = __importDefault(require("./Curate"));
const Playlists_1 = __importDefault(require("./Playlists"));
const store_1 = require("../store");
// import logo from "../static/logo_transparent.png";
const logo = "";
function Navbar() {
    const user = store_1.useStore(state => state.user.me);
    return (React.createElement("nav", { className: "navbar" },
        React.createElement("div", { className: "navbar-brand" },
            React.createElement("a", { href: "/", className: "navbar-item is-logo" },
                React.createElement("img", { src: logo || "" }))),
        React.createElement("div", { className: "navbar-menu" },
            React.createElement("div", { className: "navbar-start" },
                React.createElement(react_router_dom_1.NavLink, { to: "/curate", className: "navbar-item", activeClassName: "is-active" }, "Curate"),
                React.createElement(react_router_dom_1.NavLink, { to: "/playlists", className: "navbar-item", activeClassName: "is-active" }, "Playlists")),
            React.createElement("div", { className: "navbar-end" },
                React.createElement("div", { className: "navbar-item" },
                    "Welcome, ",
                    user.display_name),
                React.createElement("div", { className: "navbar-item" },
                    React.createElement("a", { href: "/auth/logout", className: "button is-primary is-inverted is-outlined" }, "Logout"))))));
}
function Main() {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(React.Fragment, null,
            React.createElement(Navbar, null),
            React.createElement("section", { className: "section" },
                React.createElement("div", { className: "container" },
                    React.createElement(react_router_dom_1.Switch, null,
                        React.createElement(react_router_dom_1.Redirect, { exact: true, from: "/", to: "/curate" }),
                        React.createElement(react_router_dom_1.Route, { path: "/curate", component: Curate_1.default }),
                        React.createElement(react_router_dom_1.Route, { path: "/playlists", component: Playlists_1.default })))))));
}
exports.default = Main;
//# sourceMappingURL=Main.js.map