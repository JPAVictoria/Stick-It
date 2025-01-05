"use client";

import '@/app/styles/register.css';
import '@/app/globals.css';
import Navbar from '@/app/components/Navbar';

export default function Register() {
  return (
    <div>
      <Navbar />
      <div className='alignment-reg'>
      <div className="wrapper">
        <h2>Registration</h2>
        <form action="#">
          <div className="input-box">
            <input type="text" placeholder="Enter your name" required />
          </div>
          <div className="input-box">
            <input type="email" placeholder="Enter your email" required />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Create password" required />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Confirm password" required />
          </div>
          <div className="policy">
            <input type="checkbox" required />
            <h3>I accept all terms & conditions</h3>
          </div>
          <div className="input-box button">
            <input type="submit" value="Register Now" />
          </div>
          <div className="text">
            <h3>
              Already have an account? <a href="#">Login now</a>
            </h3>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
