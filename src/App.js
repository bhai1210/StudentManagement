import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import User from "./Pages/User";
import StudentFormPage from "./Student/StudentFormPage";
import StudentListPage from "./Student/StudentListPage";
import StudentViewPage from "./Student/StudentViewPage";
import PrivateRoute from "./Copmonents/PrivateRoute";
import { useAuth } from "./Context/AuthContext";
import Sidebar from "./Copmonents/Sidebar";
import Header from "./Copmonents/Header";
import ClassCreate from "./ClassManagement/ClassCreate";
import ExtraCrud from "./ExtraCrud/ExtraCrud";
import ExtraCrudOne from "./ExtraCrud/ExtraCrudOne/ExtraCrudOne";

import "./App.css";
import StudentDashboard from "./SuperComponents/StudentDashboard/StudentDashboard";

export default function App() {
  const { token, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-redirect based on role if logged in
  useEffect(() => {
    if (token) {
      if (role === "admin" && location.pathname === "/") {
        navigate("/User", { replace: true });
      } else if (role !== "admin" && location.pathname === "/") {
        navigate("/Students", { replace: true });
      }
    }
  }, [token, role, navigate, location.pathname]);

  if (!token) {
    return (
      <div className="app-public">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Routes */}
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
            <Route
              path="/User"
              element={
                <PrivateRoute>
           <StudentDashboard />
                </PrivateRoute>
              }
            />
              <Route
              path="/staff"
              element={
                <PrivateRoute>
           <User />
                </PrivateRoute>
              }
            />
            <Route
              path="/Info"
              element={
                <PrivateRoute>
                  <ExtraCrud />
                </PrivateRoute>
              }
            />
            <Route
              path="/StudentInfo"
              element={
                <PrivateRoute>
                  <ExtraCrudOne />
                </PrivateRoute>
              }
            />
            <Route
              path="/ClassCreate"
              element={
                <PrivateRoute>
                  <ClassCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/Students"
              element={
                <PrivateRoute>
                  <StudentListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/Students/add"
              element={
                <PrivateRoute>
                  <StudentFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/Students/edit/:id"
              element={
                <PrivateRoute>
                  <StudentFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/Students/view/:id"
              element={
                <PrivateRoute>
                  <StudentViewPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
