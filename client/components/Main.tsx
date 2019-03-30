import * as React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./Navbar";
import Curate from "./Curate";
import Playlists from "./Playlists";

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
