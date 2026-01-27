"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Users, 
  Settings,
  Shield,
  BarChart3,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "All Projects",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    title: "Information Requests",
    href: "/admin/requests",
    icon: MessageSquare,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Reviewers",
    href: "/admin/reviewers",
    icon: Users,
  },
];

const secondaryItems: NavItem[] = [
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/admin/help",
    icon: HelpCircle,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
              <Link href="/admin" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DSTI Admin</h1>
                  <p className="text-xs text-gray-500">R&D Tax Incentives</p>
                </div>
              </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main Menu
              </p>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-red-50 text-red-700 shadow-sm"
                        : item.highlight
                        ? "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-red-600" : item.highlight ? "text-white" : "text-gray-500"
                    )} />
                    <span>{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600" />
                    )}
                  </Link>
                );
              })}

              {/* Secondary Navigation */}
              <div className="pt-6">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Resources
                </p>
                {secondaryItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-red-50 text-red-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive ? "text-red-600" : "text-gray-400"
                      )} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Admin Panel</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Manage applications and users securely.
                    </p>
                    <Link 
                      href="/admin/help" 
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      Get Support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
