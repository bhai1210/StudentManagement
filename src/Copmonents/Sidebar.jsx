import React, { useEffect, useRef } from "react";
import "../Styles/SidebarLayout.css";
import { useAuth } from "../Context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();


  
  const sidebarRef = useRef(null);

  // Define menu items for each role
  const menuItems = {
    admin: [
      { label: "Dashboard", path: "/User" },
       { label: "Admin Panel ", path: "/staff" },
        // { label: "Student Management", path: "/Students" },
         { label: "Add Products", path: "/ClassCreate" },
       
          // { label: "Course Information", path: "/StudentDashboard" },
          
             { label: "Purchase Items", path: "/purchase" },
              { label: "Payement Gateway", path: "/razorpay" },
    ],
    user: [
      
     { label: "Student Dashboard", path: "/BetaDashboard" },
      //  { label: "Course Information", path: "/StudentDashboard" },
                  { label: "Purchase Items", path: "/purchase" },
     
        // {label:"Student Info by image",path:"/StudentInfo"}
    ],
  };

  const items = role === "admin" ? menuItems.admin : menuItems.user;

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="logo">Payment App</h2>

      <ul className="menu-list">
        {items.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setIsOpen(false)} // also close when navigating
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
