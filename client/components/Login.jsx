import React from 'react'
import Icon from './Icon'
import logo from '../static/logo_transparent.png'

export default function Login() {
  return (
    <section className="hero is-black login-page is-fullheight">
      <div className="div hero-body">
        <div className="div container has-text-centered">
          <img src={logo} className="banner" />
          <h3 className="is-size-3">Welcome!</h3>
          <p className="subtitle">To start discovering new music, please</p>
          <div className="login-button">
            <a href="/auth/login" className="button is-spotify">
              <Icon icon="fab fa-spotify"/>
              &nbsp;&nbsp;Login with Spotify
            </a>
          </div>
          <br />
        </div>
      </div>
    </section>
  )
}
