import { createContext, useState } from "react";
import { login } from "../api/authService"; // ✅ CORRECT

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = async (email, password) => {
    const jwt = await login(email, password);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, login: handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
