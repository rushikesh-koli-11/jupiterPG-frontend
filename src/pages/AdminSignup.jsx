import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authService";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Admin registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ padding: 20 }}>
      <h3>Admin Sign Up</h3>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
      />
      <br /><br />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <br /><br />

      <button type="submit">Register</button>
    </form>
  );
}
