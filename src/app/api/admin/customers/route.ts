import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: { _count: { select: { inquiries: true, reviews: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(customers);
}
