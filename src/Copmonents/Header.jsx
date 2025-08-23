import React from "react";
import { Menu as MenuIcon, Close as CloseIcon, Notifications } from "@mui/icons-material";
import PropTypes from "prop-types";
import "./Header.css"; // Make sure this file exists

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <h1 className="app-title"></h1>
      </div>

      <div className="header-right">
        {/* <div className="notification">
          <Notifications />
          <span className="badge">3</span>
        </div> */}
        <div className="profile">

              <span className="profile-name">Rahul Bhavsar</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="profile-avatar"
          />
      
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
