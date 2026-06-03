import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const data = await req.json();
    const updatedCustomer = await prisma.user.update({
      where: { id },
      data: { name: data.name, phone: data.phone },
    });
    return NextResponse.json(updatedCustomer);
  } catch {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
