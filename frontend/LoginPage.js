import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "sumalikhithaguddeti@gmail.com" && password === "suma@4249A") {
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
  <h2>Login</h2>
  <form onSubmit={handleLogin}>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button type="submit">Login</button>
    <p>Don’t have an account? <a href="/signup">Signup</a></p>
  </form>
</div>
  );
}
