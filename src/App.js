import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
// import 'antd/dist/antd.css';
// import 'antd/dist/reset.css'; // for Ant Design v5

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import User from "./Pages/User";
import StudentFormPage from "./Student/StudentFormPage";
import StudentListPage from "./Student/StudentListPage";
import Home from "./Copmonents/Home";
import StudentViewPage from "./Student/StudentViewPage";
import PrivateRoute from "./Copmonents/PrivateRoute";
import { useAuth } from "./Context/AuthContext";
import Sidebar from "./Copmonents/Sidebar";

import "./App.css"; // responsive styles
import ClassCreate from "./ClassManagement/ClassCreate";

export default function App() {
  const { token } = useAuth();
  const role = localStorage.getItem("roles");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) {
    return (
      <div className="app-public">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Admin" element={<Register />} />
          <Route path="/User" element={<User />} />
          <Route path="/Students" element={<StudentListPage />} />
          <Route path="/Students/add" element={<StudentFormPage />} />
          <Route path="/Students/edit/:id" element={<StudentFormPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/Students/view/:id" element={<StudentViewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  return (
    <div className="app-private">
      {/* Sidebar */}
      <Sidebar role={role} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="app-main">
        {/* Topbar */}
        <header className="topbar">
          <h1  className="title ">Managment</h1>
          <button
            className="hamburger"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </header>

        <main className="content">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/User" element={<User />} />
              <Route path="/ClassCreate" element={<ClassCreate />} />
            <Route path="/Students" element={<StudentListPage />} />
            <Route path="/Students/add" element={<StudentFormPage />} />
            <Route path="/Students/edit/:id" element={<StudentFormPage />} />
            <Route path="/Students/view/:id" element={<StudentViewPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
