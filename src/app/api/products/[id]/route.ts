import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true, reviews: { where: { approved: true }, include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: 'desc' } } },
  });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const product = await prisma.product.update({ where: { id }, data, include: { category: true } });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Delete related records that don't have Cascade delete enabled in the schema
    await prisma.inquiryItem.deleteMany({ where: { productId: id } });
    
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json({ error: 'Failed to delete product. It may be linked to other records.' }, { status: 500 });
  }
}
