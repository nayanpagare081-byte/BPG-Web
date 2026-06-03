import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    // Update the database role to ADMIN
    await prisma.user.update({
      where: { email: session.user.email },
      data: { role: 'ADMIN' }
    });
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
