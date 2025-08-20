import React from "react";
import "../Styles/SidebarLayout.css";
import { useAuth } from "../Context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Define menu items for each role
  const menuItems = {
    admin: [
      
      { label: "Manage Teachers", path: "/User" },
      // { label: "Reports", path: "/reports" },
      // { label: "Settings", path: "/settings" },
    ],
    user: [
      { label: "Student Management", path: "/Students" },
        { label: "Classes Making", path: "/ClassCreate" },
    ],
  };

  const items = role === "admin" ? menuItems.admin : menuItems.user;

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="logo">MyApp</h2>

      <ul className="menu-list">
        {items.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
