"use client";

import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { useRouter } from 'next/navigation'; // Import useRouter for page navigation

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const router = useRouter(); // Initialize useRouter for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    setSnackbarMessage('');
    setSnackbarSeverity('success'); // Reset to default state before making the request.

    try {
      const response = await fetch('/api/login', { // API endpoint to authenticate user
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage('Login successful!');
        setSnackbarSeverity('success');
        
        // Redirect to the 'notepage' after successful login
        router.push('/notepage'); 

      } else {
        setSnackbarMessage(data.error || 'Invalid credentials');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      setSnackbarMessage('Failed to connect to the server.');
      setSnackbarSeverity('error');
    } finally {
      // Reset form data after handling the response
      setFormData({
        email: '',
        password: '',
      });
      setSnackbarOpen(true); // Always open the snackbar, even in the case of an error
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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

        <button type="submit" className="loginbutton">Log In</button>
      </form>

      {/* Snackbar for displaying success or error messages */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        message={snackbarMessage}
        key={SlideTransition.name}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'bottom',  // Align to the bottom of the screen
          horizontal: 'left',  // Align to the left of the screen
        }}
        ContentProps={{
          style: { 
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
            position: 'fixed',  // Fixes the Snackbar position relative to the viewport
            top: '480px',      // Adds a small spacing from the bottom
            right: '1200px',        // Adds a small spacing from the left
            zIndex: 9999,        // Makes sure it sits on top of other elements
          },
        }}
      />
    </div>
  );
}
