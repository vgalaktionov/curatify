import * as React from "react";

import playing from "../static/playing.svg";

export default function Loading() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-desktop is-centered">
          <div className="column is-narrow is-vcentered has-text-centered">
            <img className="preloader" src={playing} />
            <br />
            <h3 className="is-size-3">Finding awesome music for you...</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
