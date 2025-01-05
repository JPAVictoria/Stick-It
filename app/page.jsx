"use client";

import '@/app/styles/login.css';
import '@/app/globals.css';
import Login from '@/app/components/Login.jsx';
import Navbar from '@/app/components/Navbar';


export default function Home() {

  return (
    <div>
      <Navbar />
      <div>
        <ul className="background">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className='alignment grid grid-cols-1 md:grid-cols-2'>
        <div className='text-content '>
          <h1>Paste Now!</h1>
          <p>Welcome to STICK IT — a simple sticky note project to practice creating, reading, updating, and deleting (CRUD) functionality. Built with Next.js, React, Tailwind, REST APIs, and Prisma, this web application lets you create and manage notes, making it easy 
          to stick and organize your ideas. </p>
        </div>
        <div className='login-alignment'>
          <Login />
        </div>
      </div>
    </div>
  );
}
