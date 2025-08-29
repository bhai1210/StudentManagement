import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./AuthComponents/Login";
import Register from "./AuthComponents/Register";
import Dashboard from "./AuthComponents/Dashboard";
import ForgotPassword from "./AuthComponents/ForgotPassword";
import ResetPassword from "./AuthComponents/ResetPassword";
import User from "./AuthComponents/User";


import PrivateRoute from "./Copmonents/LayoutComponents/PrivateRoute/PrivateRoute";
import { useAuth } from "./Context/AuthContext";
import Sidebar from "./Copmonents/LayoutComponents/Sidebar/Sidebar";
import Header from "./Copmonents/LayoutComponents/Header/Header";
import ClassCreate from "./Copmonents/ProductManagement/CreateProduct";


import "./App.css";
import StudentDashboard from "./Copmonents/AdminDashbord/AdminDashboard";

import BetaDashboard from "./Copmonents/UserDashboard/userdashboard";
import RazorpayPayment from "./Copmonents/Payment/RazorpayPayment";
import PurchaseItem from "./Copmonents/ProductManagement/PurchaseItem";

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
        navigate("/BetaDashboard", { replace: true });
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
              path="/BetaDashboard"
              element={
                <PrivateRoute>
                  <BetaDashboard />
               </PrivateRoute>
              }
            />
             <Route
              path="/razorpay"
              element={
                <PrivateRoute>
                  <RazorpayPayment />
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
              path="/purchase"
              element={
                <PrivateRoute>
        <PurchaseItem />
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
              path="/ClassCreate"
              element={
                <PrivateRoute>
                  <ClassCreate />
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
