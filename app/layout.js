"use client";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <title>Stick it | CRUD Next.js</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
