export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin layout with top bar */}
      <header className="bg-white border-b">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">DSTI Admin</h1>
          <div className="text-sm text-gray-600">Admin User</div>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-65px)] p-4">
          <nav className="space-y-2">
            <a href="/admin" className="block px-4 py-2 rounded hover:bg-blue-50">Dashboard</a>
            <a href="/admin/applications" className="block px-4 py-2 rounded hover:bg-blue-50">Applications</a>
            <a href="/admin/reviewers" className="block px-4 py-2 rounded hover:bg-blue-50">Reviewers</a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
