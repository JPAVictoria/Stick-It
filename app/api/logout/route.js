import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
  // Remove the JWT cookie
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.headers.set('Set-Cookie', serialize('jwt', '', { path: '/', maxAge: -1 }));
  return response;
}
