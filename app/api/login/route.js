import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if email exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 400 });
    }

    // Compare the password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 400 });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'your-secret-key', // Use a secure secret key
      { expiresIn: '1h' }
    );

    // Return the token in the response cookies for future requests
    const response = new Response(JSON.stringify({ token }));
    response.headers.set('Set-Cookie', `jwt=${token}; HttpOnly; Path=/; Max-Age=3600`); // 1-hour expiry

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
