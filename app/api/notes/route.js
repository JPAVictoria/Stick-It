import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Handle GET request (Fetch all notes or filter by date)
export async function GET(req) {
  console.log('Handling GET request for notes');
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    console.error('Unauthorized: No token provided');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const decodedToken = verifyToken(token);
  console.log('Decoded token:', decodedToken);

  if (!decodedToken) {
    console.error('Unauthorized: Invalid token');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // Get the 'date' query parameter

  try {
    let notes;

    if (date) {
      // If a date is provided, filter notes by the createdAt date (same day)
      const startOfDay = new Date(date + 'T00:00:00');
      const endOfDay = new Date(date + 'T23:59:59');

      notes = await prisma.note.findMany({
        where: {
          userId: decodedToken.id,
          deleted: false,
          createdAt: {
            gte: startOfDay, // Start of the day
            lt: endOfDay, // End of the day
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // If no date is provided, fetch all notes
      notes = await prisma.note.findMany({
        where: { userId: decodedToken.id, deleted: false },
        orderBy: { createdAt: 'desc' },
      });
    }

    console.log('Notes fetched successfully:', notes);
    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}

// Handle POST request (Create new note)
export async function POST(req) {
  console.log('Handling POST request for new note');
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    console.error('Unauthorized: No token provided');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const decodedToken = verifyToken(token);
  console.log('Decoded token:', decodedToken);

  if (!decodedToken) {
    console.error('Unauthorized: Invalid token');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const requestBody = await req.json();
    console.log('Request body:', requestBody);

    const { title, description } = requestBody;

    if (!title || !description) {
      console.error('Bad Request: Title and description are required');
      return new Response(JSON.stringify({ error: 'Title and description are required' }), { status: 400 });
    }

    const payload = {
      title,
      description,
      userId: decodedToken.id,
    };

    console.log('Payload for creating note:', payload);

    const newNote = await prisma.note.create({
      data: payload,
    });

    console.log('Note created successfully:', newNote);
    return new Response(JSON.stringify(newNote), { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}
