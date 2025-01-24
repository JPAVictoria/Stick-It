"use client";
import { useState } from "react";
import { useSnackbar } from "@/app/components/Snackbar.jsx"; // Import useSnackbar hook for showing snackbar
import Loader from "@/app/components/Loader.jsx"; // Import the loader
import "@/app/styles/forgot-password.css";

export default function ResetPassword() {
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    // Validate password length
    if (password.length < 8) {
      showSnackbar("Password must be at least 8 characters long", "error");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar("Password reset successfully!", "success");
        window.location.href = "/"; // Redirect to the login page after success
      } else {
        showSnackbar(data.error || "Failed to reset password", "error");
      }
    } catch (err) {
      showSnackbar("Failed to connect to the server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 rounded-lg shadow-lg border-2 border-white/10 backdrop-blur-md w-full max-w-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Reset Your Password
          </h1>
        </div>

        {loading && <Loader />} {/* Show loader when loading */}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold mb-2 text-gray-800 dark:text-white"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                required
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm mt-8 font-bold mb-2 text-gray-800 dark:text-white"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="mb-3 py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                required
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            disabled={loading} // Disable the button while loading
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
