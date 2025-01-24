"use client";

import { useState } from 'react';
import { useSnackbar } from '@/app/components/Snackbar.jsx';
import Loader from '@/app/components/Loader.jsx';
import "@/app/styles/forgot-password.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        showSnackbar('Password reset link sent to your email.', 'success');
      } else {
        showSnackbar(data.error || 'Something went wrong', 'error');
      }
    } catch (err) {
      showSnackbar('Failed to connect to the server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 rounded-lg shadow-lg border-2 border-white/10 backdrop-blur-md w-full max-w-md p-6">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <a
                className="dark:text-white decoration-2 hover:underline font-medium cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                Login here
              </a>
            </p>
          </div>

          <div className="mt-5">
            {loading && <Loader />}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Reset password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
