"use client";

import { useState } from 'react';
import Link from 'next/link';
import '@/app/styles/register.css';
import Navbar from '@/app/components/Navbar';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Loader from '@/app/components/Loader'; // Import the loader component

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const [loading, setLoading] = useState(false); // Add a loading state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Set loading to true

    const { name, email, password, confirmPassword } = formData;

    // Simple client-side validation
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false); // Set loading to false
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.text(); // Use text() here since the response is plain text
      console.log("Response from server:", data);  // Log the response for debugging

      if (response.ok) {
        setSnackbarMessage('User registered successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        // Handle email already in use error
        if (data.includes('Email already in use')) {
          setSnackbarMessage('Email is already in use.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(data || 'Something went wrong.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    } catch (err) {
      setSnackbarMessage('Failed to connect to the server.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <div className="alignment-reg">
        <div className="wrapper">
          <h2>Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box button">
              <input type="submit" value="Register Now" />
            </div>
            <div className="text">
              <h3>
                Already have an account? <Link href="/">Login now</Link>
              </h3>
            </div>
          </form>
        </div>
      </div>

      {/* Snackbar for displaying success or error messages */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        message={snackbarMessage}
        key={SlideTransition.name}
        autoHideDuration={2000}
        ContentProps={{
          style: { backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' },
        }}
      />
    </div>
  );
}
