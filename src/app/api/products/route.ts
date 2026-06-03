import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const sort = searchParams.get('sort');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  const where: Record<string, unknown> = {};
  if (category) where.category = { slug: category };
  if (featured === 'true') where.featured = true;
  if (search) where.OR = [
    { name: { contains: search } },
    { description: { contains: search } },
  ];

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_low') orderBy = { price: 'asc' };
  else if (sort === 'price_high') orderBy = { price: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };
  else if (sort === 'featured') orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, include: { category: true, _count: { select: { reviews: true } } },
      skip: (page - 1) * limit, take: limit, orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, pages: Math.ceil(total / limit), page });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({ data, include: { category: true } });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
