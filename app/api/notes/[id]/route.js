import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the JWT token
  } catch (error) {
    console.error('Token verification failed:', error);
    return null; // Return null if the token is invalid
  }
};

// Handle GET request (Fetch specific note by ID)
export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Verify the token
  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop(), 10); // Ensure the id is correctly parsed as an integer

    if (isNaN(id)) {
      console.error(`Invalid ID: ${id}`);
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    // Fetch note by ID for the logged-in user
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return new Response(JSON.stringify({ error: 'Note not found' }), { status: 404 });
    }

    // Ensure the logged-in user can only view their own notes
    if (note.userId !== decodedToken.id) { // Use consistent extraction of userId
      return new Response(JSON.stringify({ error: 'Forbidden: You cannot view someone else\'s note' }), { status: 403 });
    }

    return new Response(JSON.stringify(note), { status: 200 });
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}

// Handle PUT request (Update specific note by ID)
export async function PUT(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Verify the token
  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop(), 10); // Ensure the id is correctly parsed as an integer

    if (isNaN(id)) {
      console.error(`Invalid ID: ${id}`);
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    // Extract the request payload
    const { title, description, deleted } = await req.json();

    if (title === undefined && description === undefined && deleted === undefined) {
      return new Response(JSON.stringify({ error: 'At least one field (title, description, or deleted) is required' }), { status: 400 });
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return new Response(JSON.stringify({ error: 'Note not found' }), { status: 404 });
    }

    // Ensure the logged-in user can only edit their own notes
    if (note.userId !== decodedToken.id) { // Use consistent extraction of userId
      return new Response(JSON.stringify({ error: 'Forbidden: You cannot edit someone else\'s note' }), { status: 403 });
    }

    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (deleted !== undefined) updatedData.deleted = deleted;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { ...updatedData, updatedAt: new Date() },
    });

    return new Response(JSON.stringify(updatedNote), { status: 200 });
  } catch (error) {
    console.error('Error updating note by ID:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}
