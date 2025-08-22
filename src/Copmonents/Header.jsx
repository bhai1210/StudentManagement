import React from "react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import "./Header.css"; // create a separate CSS file for header styles

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">Student Management</h1>
      </div>
      <div className="header-right">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
