import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { productId, rating, comment } = await req.json();

  const review = await prisma.review.create({
    data: { userId, productId, rating, comment },
  });
  return NextResponse.json(review, { status: 201 });
}
