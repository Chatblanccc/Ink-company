import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { signInSchema } from "@/lib/forms";
import { getPrismaClient } from "@/lib/prisma";

const fallbackAdmin = {
  id: "demo-admin",
  name: "Demo Admin",
  email: process.env.ADMIN_EMAIL ?? "admin@ink-company.com",
  password: process.env.ADMIN_PASSWORD ?? "InkAdmin2026!",
  role: "SUPER_ADMIN",
} as const;

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/admin/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const prisma = getPrismaClient();

        if (prisma) {
          try {
            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (user?.passwordHash) {
              const isValid = await compare(password, user.passwordHash);

              if (isValid) {
                return {
                  id: user.id,
                  name: user.name ?? user.email,
                  email: user.email,
                  role: user.role,
                };
              }
            }
          } catch {
            // Fall back to demo credentials when the database is not reachable.
          }
        }

        if (
          email === fallbackAdmin.email &&
          password === fallbackAdmin.password
        ) {
          return {
            id: fallbackAdmin.id,
            name: fallbackAdmin.name,
            email: fallbackAdmin.email,
            role: fallbackAdmin.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? fallbackAdmin.id;
        session.user.role = typeof token.role === "string" ? token.role : "EDITOR";
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "ink-company-local-secret",
};
