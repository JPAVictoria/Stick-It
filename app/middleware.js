import jwt from 'jsonwebtoken';

export function middleware(req) {
  const token = req.cookies.get('jwt'); // Access the JWT from cookies

  if (!token) {
    return new Response('Not authenticated', { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded; // Attach user data to the request
  } catch (error) {
    return new Response('Invalid or expired token', { status: 401 });
  }

  return new Response('Success', { status: 200 });
}
