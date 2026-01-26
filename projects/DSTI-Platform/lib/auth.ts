import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Resend from "next-auth/providers/resend";
import { authConfig } from "@/auth.config";
import { getMagicLinkEmailHtml, getMagicLinkEmailText } from "@/lib/email-template";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: `Sign in to DSTI R&D Platform`,
            html: getMagicLinkEmailHtml(url),
            text: getMagicLinkEmailText(url),
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to send verification email");
        }
      },
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
    async jwt({ token, user, trigger }) {
      // On sign-in, store the user's role
      if (user) {
        token.role = (user as { role: string }).role;
      }
      // Ensure role persists through token updates
      if (trigger === "update" && !token.role) {
        // Fetch role from database if missing
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours - session expires after 12 hours of inactivity
    updateAge: 60 * 60, // 1 hour - refresh token every hour of activity
  },
  trustHost: true, // Trust the host header
  debug: process.env.NODE_ENV === "development",
});
