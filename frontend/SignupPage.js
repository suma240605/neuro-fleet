import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './signup.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [users, setUsers] = useState([]); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.password) {
      alert("Username or password cannot be empty!");
      return;
    }

    if (users.includes(formData.name)) {
      alert("Username already taken! Choose another.");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      alert("Weak password! Use at least 6 characters with uppercase, lowercase, and a number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setUsers([...users, formData.name]);
    alert("Signup successful! Now login.");
    navigate("/");
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2>Signup</h2>
        <input type="text" name="name" placeholder="Username" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
        <button type="submit">Signup</button>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
}
