import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const user = session?.user as { role?: string } | undefined;
  
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { inquiries: true, reviews: true }
        }
      }
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  const currentUser = session?.user as { role?: string, email?: string } | undefined;
  
  if (currentUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { id, role } = data;

    if (!id || !role) {
      return NextResponse.json({ error: 'Missing id or role' }, { status: 400 });
    }

    // Protect against removing the last admin or oneself
    if (role !== 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot remove the last administrator' }, { status: 400 });
      }
      
      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (targetUser?.email === currentUser.email) {
        return NextResponse.json({ error: 'Cannot demote yourself while logged in' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      include: { _count: { select: { inquiries: true, reviews: true } } }
    });

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
