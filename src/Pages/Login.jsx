import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Services/api";
import { useAuth } from "../Context/AuthContext";
import "../Styles/login.css"; // CSS file

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", form);
      const token = res.data.token;
      const roles = res?.data?.user?.role;
      localStorage.setItem("roles", roles);
      login(token);

      // Decode token for redirect
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role || "user";

      toast.success("Login successful!", { autoClose: 2000 });

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || "Invalid email or password";
      toast.error(msg, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        {/* Left Image */}
        <div className="login-image-container">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Login illustration"
            className="login-image"
          />
        </div>

        {/* Right Form */}
        <div className="login-form-container">
          <div className="login-card">
            <h2 className="login-title">Login to Your Account</h2>

            <form className="login-form" onSubmit={onSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={onChange}
                required
                className="login-input"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                required
                className="login-input"
              />

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>

              <p className="register-text">
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="register-btn"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </section>
  );
}
