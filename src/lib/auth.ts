import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          console.log("LOGIN ATTEMPT:", credentials?.email);

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing email or password');
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error('User not found');
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          };
        } catch (err) {
          console.error("AUTH ERROR:", err);
          return null; // 🔥 IMPORTANT: prevents hanging
        }
      },
    }),

    // ✅ Only enable Google if keys exist
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.role = (user as { role?: string }).role || 'CUSTOMER';
          token.id = user.id;
        }

        if (account?.provider === 'google') {
          const existingUser = await prisma.user.findUnique({
            where: { email: token.email! },
          });

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                name: token.name!,
                email: token.email!,
                image: token.picture,
                role: 'CUSTOMER',
              },
            });

            token.id = newUser.id;
            token.role = newUser.role;
          } else {
            token.id = existingUser.id;
            token.role = existingUser.role;
          }
        }

        return token;
      } catch (err) {
        console.error("JWT ERROR:", err);
        return token;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: unknown }).id = token.id as string;
        (session.user as { role?: unknown }).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};