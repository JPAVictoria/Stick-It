"use client";
import "./globals.css";


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <title>Next.js CRUD | Stick it</title>
      </head>
      <body>
          {children}
      </body>
    </html>
  );
}
