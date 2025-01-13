"use client";

import "@/app/styles/login.css";
import { useState } from "react";
import { useSnackbar } from "@/app/components/Snackbar.jsx"; // Access the global snackbar
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Add loading state
  const { showSnackbar } = useSnackbar(); // Access the global snackbar

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar("Login successful!", "success");

        // Trigger hard navigation (full page reload)
        window.location.href = "/notepage"; // This forces a full reload to the new page
      } else {
        showSnackbar(data.error || "Invalid credentials", "error");
      }
    } catch (err) {
      showSnackbar("Failed to connect to the server.", "error");
    } finally {
      setLoading(false); // Set loading to false once the request is complete
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        <label htmlFor="email">Email</label>
        <input
          className="inputs"
          type="email"
          placeholder="Email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          className="inputs"
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" className="loginbutton" disabled={loading}>
          {loading ? "Logging in..." : "Log In"} {/* Display loading text */}
        </button>
      </form>

      {/* Show loader when the form is submitting */}
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
