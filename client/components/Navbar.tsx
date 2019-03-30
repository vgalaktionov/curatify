import React, { useState } from "react";
import { NavLink as Link } from "react-router-dom";

import { useStore } from "../store";

import logo from "../static/logo_transparent.png";

interface MenuProps {
  isActive: boolean;
}

const Menu = ({ isActive }: MenuProps) => {
  const user = useStore(state => state.user.me);
  return (
    <div className={`navbar-menu ${isActive && "is-active"}`}>
      <div className="navbar-start">
        <Link to="/curate" className="navbar-item" activeClassName="is-active">
          Curate
        </Link>
        <Link to="/playlists" className="navbar-item" activeClassName="is-active">
          Playlists
        </Link>
      </div>
      <div className="navbar-end">
        {isActive || <div className="navbar-item">Welcome, {user.display_name}</div>}
        <div className="navbar-item">
          <a href="/auth/logout" className="button is-primary is-inverted is-outlined">
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <nav className="navbar" onBlur={() => setShowMenu(false)} tabIndex={1}>
      <div className="navbar-brand">
        <a href="/" className="navbar-item is-logo">
          <img src={logo} />
        </a>
        <a
          role="button"
          className={`navbar-burger ${showMenu && "is-active"}`}
          aria-label="menu"
          aria-expanded="false"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>
      <Menu isActive={showMenu} />
    </nav>
  );
}
