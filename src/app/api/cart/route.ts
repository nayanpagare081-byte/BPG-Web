import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const items = await prisma.cartItem.findMany({
    where: { userId }, include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { productId, quantity = 1 } = await req.json();

  const existing = await prisma.cartItem.findUnique({ where: { userId_productId: { userId, productId } } });
  if (existing) {
    const updated = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity }, include: { product: true } });
    return NextResponse.json(updated);
  }
  const item = await prisma.cartItem.create({ data: { userId, productId, quantity }, include: { product: true } });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await prisma.cartItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
