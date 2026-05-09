import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.user as { id: string; role: string };
  const where = user.role === 'ADMIN' ? {} : { userId: user.id };

  const inquiries = await prisma.inquiry.findMany({
    where, include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(inquiries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const userId = session?.user ? (session.user as { id: string }).id : null;

  const inquiry = await prisma.inquiry.create({
    data: {
      userId, name: body.name, email: body.email, phone: body.phone, message: body.message,
      items: { create: body.items.map((item: { productId: string; quantity: number; message?: string }) => ({
        productId: item.productId, quantity: item.quantity || 1, message: item.message,
      })) },
    },
    include: { items: { include: { product: true } } },
  });

  // Clear cart if logged in
  if (userId) await prisma.cartItem.deleteMany({ where: { userId } });

  return NextResponse.json(inquiry, { status: 201 });
}
