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

  const { showSnackbar } = useSnackbar(); // Access the global snackbar
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

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
        router.push("/notepage");
      } else {
        showSnackbar(data.error || "Invalid credentials", "error");
      }
    } catch (err) {
      showSnackbar("Failed to connect to the server.", "error");
    } finally {
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

        <button type="submit" className="loginbutton">
          Log In
        </button>
      </form>
    </div>
  );
}
