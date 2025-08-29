import React, { useEffect, useState } from "react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import "./Header.css";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
        <div className="profile">
          <span className="profile-name">
            {user ? user.email : "Guest"}
          </span>
          {/* <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="profile-avatar"
          /> */}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
