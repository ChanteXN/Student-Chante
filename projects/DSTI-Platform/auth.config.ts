import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token during sign-in
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role from token to session
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as typeof session.user.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public routes that don't require authentication
      const publicRoutes = ["/", "/login", "/auth/verify-request", "/auth/error"];
      if (publicRoutes.includes(pathname) || pathname.startsWith("/api/auth")) {
        return true;
      }

      // Check if user is authenticated
      if (!isLoggedIn) {
        return false; // Will redirect to login page
      }

      const userRole = auth.user?.role;

      // Admin routes - only ADMIN can access
      if (pathname.startsWith("/admin")) {
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/portal", nextUrl));
        }
        return true; // Explicitly allow ADMIN users
      }

      // Reviewer routes - only REVIEWER and ADMIN can access
      if (pathname.startsWith("/portal/reviews")) {
        if (userRole !== "REVIEWER" && userRole !== "ADMIN") {
          return Response.redirect(new URL("/portal", nextUrl));
        }
      }

      // Portal routes - all authenticated users can access
      if (pathname.startsWith("/portal")) {
        if (userRole === "APPLICANT" && pathname.startsWith("/portal/reviews")) {
          return Response.redirect(new URL("/portal", nextUrl));
        }
      }

      return true;
    },
  },
  providers: [], // Providers added in auth.ts for Node.js runtime
} satisfies NextAuthConfig;
