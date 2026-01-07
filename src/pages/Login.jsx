import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lux-login">
      <div className="container">

        <div className="lux-login-card">
          <h3 className="lux-login-title">
            <i className="bi bi-shield-lock-fill"></i> Admin Login
          </h3>

          <p className="lux-login-subtitle">
            Secure access for Jupiter PG administrators
          </p>

          <form onSubmit={submit}>

            <div className="lux-login-field">
              <i className="bi bi-envelope-fill"></i>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="lux-login-field">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="lux-login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
