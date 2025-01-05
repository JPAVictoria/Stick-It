import { prisma } from '@/app/lib/prisma';

// Handle PUT request
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop(), 10); // Ensure the id is correctly parsed as an integer

    if (isNaN(id)) {
      console.error(`Invalid ID: ${id}`);
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    console.log(`Request received for note ID: ${id}`); // Debugging line

    // Extract the request payload
    const { title, description, deleted } = await req.json();

    // Ensure at least one field to update is provided
    if (title === undefined && description === undefined && deleted === undefined) {
      return new Response(JSON.stringify({ error: 'At least one field (title, description, or deleted) is required' }), { status: 400 });
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return new Response(JSON.stringify({ error: 'Note not found' }), { status: 404 });
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
    console.error(error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}

// Optionally handle GET request for testing
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop(), 10); // Ensure the id is correctly parsed as an integer

    if (isNaN(id)) {
      console.error(`Invalid ID: ${id}`);
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return new Response(JSON.stringify({ error: 'Note not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(note), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}
