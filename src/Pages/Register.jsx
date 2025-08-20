import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Services/api";
import { useNavigate } from "react-router-dom";
import "../Styles/register.css"; // <-- import CSS

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      toast.success(res.data.message || "Registered successfully!");
      setForm({ email: "", password: "", role: "user" });
    } catch (err) {
      const msg = err?.response?.data?.error || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-section">
      <div className="register-container">
        {/* Left Image */}
        <div className="register-image-container">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Register illustration"
            className="register-image"
          />
        </div>

        {/* Right Form */}
        <div className="register-form-container">
          <div className="register-card">
            <h2 className="register-title">Create Your Account</h2>

            <form className="register-form" onSubmit={onSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={onChange}
                required
                className="register-input"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                required
                className="register-input"
              />

              {/* Role Select */}
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="register-select"
              >
                <option value="user">Student</option>
                <option value="admin">Teacher</option>
              </select>

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Loading..." : "Create Account"}
              </button>

              <p className="login-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="login-btn-link"
                  onClick={() => navigate("/login")}
                >
                  Login
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
