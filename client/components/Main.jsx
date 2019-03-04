import React from 'react'
import { BrowserRouter as Router, Route, NavLink as Link, Switch } from 'react-router-dom'

import { StoreProvider, createStore, useStore, useActions } from 'easy-peasy'

import logo from '../static/logo_transparent.png'

function Navbar() {
  const user = useStore(state => state.user)
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/" className="navbar-item is-logo">
          <img src={logo} />
        </a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/curate" className="navbar-item" activeClassName="is-active">
            Curate
          </Link>
          <Link to="/playlists" className="navbar-item" activeClassName="is-active">
            Playlists
          </Link>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            Welcome, {user.displayName}
          </div>
          <div className="navbar-item">
            <a href="/auth/logout" className="button is-primary is-inverted is-outlined">
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function Main() {
  return (
  <Router>
    <Navbar />
    <section className="section">
      <div className="container">
      <Switch>
        <Route path="/curate"/>
        <Route path="/playlists"/>
      </Switch>
      </div>
    </section>
  </Router>)
}
