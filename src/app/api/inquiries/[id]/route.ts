import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();
  const inquiry = await prisma.inquiry.update({ where: { id }, data: { status } });
  return NextResponse.json(inquiry);
}
