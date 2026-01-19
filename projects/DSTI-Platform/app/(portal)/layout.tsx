"use client";

import { SessionProvider } from "next-auth/react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Portal layout with sidebar will be added in Day 5 */}
        <div className="flex">
          <aside className="w-64 bg-white border-r min-h-screen p-4">
            <div className="text-xl font-bold text-blue-600 mb-6">DSTI Portal</div>
            <nav className="space-y-2">
              <a href="/portal" className="block px-4 py-2 rounded hover:bg-blue-50">Dashboard</a>
              <a href="/portal/projects" className="block px-4 py-2 rounded hover:bg-blue-50">My Projects</a>
            </nav>
          </aside>
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
