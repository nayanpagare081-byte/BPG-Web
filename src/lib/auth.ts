import { createClient } from '@/utils/supabase/server';
import prisma from './prisma';

export async function getServerSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return null;
  }

  const supabaseUser = session.user;

  // Sync with Prisma
  let user = await prisma.user.findUnique({
    where: { email: supabaseUser.email! },
  });

  if (!user) {
    // If user doesn't exist in Prisma, create them
    user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        role: 'CUSTOMER',
      },
    });
  } else if (user.id !== supabaseUser.id) {
    // If the user exists but with a different ID (e.g. they were created locally before Supabase)
    // For local dev, we might just use their Prisma ID. But best to update the Prisma ID if possible, 
    // though SQLite doesn't allow changing Primary Keys easily if referenced.
    // We'll just return the Prisma user, but the ID will be the Prisma CUID.
  }

  const isAdmin = user.email === 'nayanpagare081@gmail.com' || user.email === 'admin@bpg.com';

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: isAdmin ? 'ADMIN' : user.role,
      image: user.image,
    }
  };
}