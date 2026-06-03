import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [totalProducts, totalInquiries, totalCustomers, pendingInquiries] = await Promise.all([
    prisma.product.count(),
    prisma.inquiry.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.inquiry.count({ where: { status: 'PENDING' } }),
  ]);

  const statusDist = await prisma.inquiry.groupBy({ by: ['status'], _count: true });
  const statusDistribution = statusDist.map((s: any) => ({ status: s.status, count: s._count }));

  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  const categoryDistribution = categories.map((c: any) => ({ name: c.name, count: c._count?.products || 0 }));

  // Fetch recent inquiries for time-series chart (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentInquiries = await prisma.inquiry.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, items: { select: { quantity: true, product: { select: { price: true } } } } }
  });

  // Group by date
  const salesDataMap = new Map<string, { date: string; inquiries: number; value: number }>();
  
  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    salesDataMap.set(dateStr, { date: dateStr, inquiries: 0, value: 0 });
  }

  recentInquiries.forEach((inq: any) => {
    const dateStr = inq.createdAt.toISOString().split('T')[0];
    if (salesDataMap.has(dateStr)) {
      const current = salesDataMap.get(dateStr)!;
      current.inquiries += 1;
      const val = inq.items.reduce((s: number, item: any) => s + (item.product.price || 0) * item.quantity, 0);
      current.value += val;
    }
  });

  const salesTrend = Array.from(salesDataMap.values());

  return NextResponse.json({
    totalProducts, totalInquiries, totalCustomers, pendingInquiries,
    statusDistribution, categoryDistribution, salesTrend
  });
}
