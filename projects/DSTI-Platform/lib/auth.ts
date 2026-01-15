import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Nodemailer from "next-auth/providers/nodemailer";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as typeof session.user.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
