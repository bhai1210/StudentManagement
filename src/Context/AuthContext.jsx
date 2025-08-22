import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() => localStorage.getItem("roles") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      if (role) localStorage.setItem("roles", role);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
    }
  }, [token, role]);

  const login = (newToken, userRole) => {
    setToken(newToken);
    setRole(userRole);
    toast.success("Login successful!");
  };

  const logout = () => {
    setToken("");
    setRole("");
    toast.info("You have been logged out.");
  };

  const value = useMemo(() => ({ token, role, login, logout }), [token, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
