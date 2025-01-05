import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const notes = await prisma.note.findMany({
    where: { deleted: false },
    orderBy: { createdAt: 'desc' },
  });

  return new Response(JSON.stringify(notes), { status: 200 });
}

export async function POST(request) {
  const { title, description } = await request.json();

  if (!title || !description) {
    return new Response('Title and description are required', { status: 400 });
  }

  const newNote = await prisma.note.create({
    data: { title, description },
  });

  return new Response(JSON.stringify(newNote), { status: 201 });
}
