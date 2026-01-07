import { useState } from "react";
import { register } from "../api/authService";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      alert("Admin registered successfully");
      navigate("/login");
    } catch {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lux-signup">
      <div className="container">

        <div className="lux-signup-card">
          <h3 className="lux-signup-title">
            <i className="bi bi-person-plus-fill"></i> Admin Signup
          </h3>

          <p className="lux-signup-subtitle">
            Create an administrator account for Jupiter PG
          </p>

          <form onSubmit={submit}>

            <div className="lux-signup-field">
              <i className="bi bi-person-fill"></i>
              <input
                type="text"
                placeholder="Full Name"
                required
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="lux-signup-field">
              <i className="bi bi-envelope-fill"></i>
              <input
                type="email"
                placeholder="Admin Email"
                required
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="lux-signup-field">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <button className="lux-signup-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Signup"}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
