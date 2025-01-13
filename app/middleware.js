import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const url = req.nextUrl; // Use `nextUrl` to handle route paths properly
  const token = req.cookies.get('jwt'); // Get the JWT token from cookies

  const publicRoutes = ['/', '/register', '/instructions'];

  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next(); // Allow the request to proceed
  }

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const secretKey = process.env.JWT_SECRET; 
    jwt.verify(token, secretKey); 
    return NextResponse.next(); 
  } catch (err) {

    return NextResponse.redirect(new URL('/', req.url));
  }
}
