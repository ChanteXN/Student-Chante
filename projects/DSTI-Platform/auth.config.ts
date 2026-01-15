import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
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

      const userRole = auth.user.role;

      // Admin routes - only ADMIN can access
      if (pathname.startsWith("/admin")) {
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/portal/dashboard", nextUrl));
        }
      }

      // Reviewer routes - only REVIEWER and ADMIN can access
      if (pathname.startsWith("/portal/reviews")) {
        if (userRole !== "REVIEWER" && userRole !== "ADMIN") {
          return Response.redirect(new URL("/portal/dashboard", nextUrl));
        }
      }

      // Portal routes - all authenticated users can access
      if (pathname.startsWith("/portal")) {
        if (userRole === "APPLICANT" && pathname.startsWith("/portal/reviews")) {
          return Response.redirect(new URL("/portal/dashboard", nextUrl));
        }
      }

      return true;
    },
  },
  providers: [], // Providers added in auth.ts for Node.js runtime
} satisfies NextAuthConfig;
