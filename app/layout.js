"use client";
import { SnackbarProvider } from "@/app/components/Snackbar";  // Import SnackbarProvider
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <title>Stick it | CRUD Next.js</title>
      </head>
      <body>
        <SnackbarProvider>  {/* Wrap the children with SnackbarProvider */}
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}
