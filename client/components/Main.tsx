import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink as Link,
  Switch,
  Redirect
} from "react-router-dom";
import Curate from "./Curate";
import Playlists from "./Playlists";

import { useStore } from "../store";

// import logo from "../static/logo_transparent.png";
const logo = "";

function Navbar() {
  const user = useStore(state => state.user.me);
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/" className="navbar-item is-logo">
          <img src={logo || ""} />
        </a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link
            to="/curate"
            className="navbar-item"
            activeClassName="is-active"
          >
            Curate
          </Link>
          <Link
            to="/playlists"
            className="navbar-item"
            activeClassName="is-active"
          >
            Playlists
          </Link>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">Welcome, {user.display_name}</div>
          <div className="navbar-item">
            <a
              href="/auth/logout"
              className="button is-primary is-inverted is-outlined"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Main() {
  return (
    <Router>
      <React.Fragment>
        <Navbar />
        <section className="section">
          <div className="container">
            <Switch>
              <Redirect exact from="/" to="/curate" />
              <Route path="/curate" component={Curate} />
              <Route path="/playlists" component={Playlists} />
            </Switch>
          </div>
        </section>
      </React.Fragment>
    </Router>
  );
}
