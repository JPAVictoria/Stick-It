import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return new Response('Email already in use', { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create JWT
    const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', {
      expiresIn: '1h',
    });

    // Return token in the response
    return new Response(JSON.stringify({ token }), { status: 201 });
  } catch (error) {
    console.error('Error during signup:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
