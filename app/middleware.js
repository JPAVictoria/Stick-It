import jwt from 'jsonwebtoken';

export function middleware(req) {
  const url = req.url;

  // Allow access to these routes without authentication
  if (url === '/' || url === '/register' || url.includes('/instructions')) {
    return new Response(null, { status: 200 });
  }

  const token = req.cookies.get('jwt'); // Access the JWT from cookies

  if (!token) {
    return new Response('Not authenticated', { status: 401 });
  }

  try {
    const secretKey = process.env.JWT_SECRET; // Retrieve the secret key from the environment variables
    const decoded = jwt.verify(token, secretKey); // Use the secret from .env file
    req.user = decoded; // Attach user data to the request
  } catch (error) {
    return new Response('Invalid or expired token', { status: 401 });
  }

  return new Response(null, { status: 200 });
}
