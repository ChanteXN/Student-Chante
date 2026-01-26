"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Settings, 
  HelpCircle,
  Plus,
  TrendingUp
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
    href: "/portal",
    icon: LayoutDashboard,
  },
  {
    title: "My Projects",
    href: "/portal/projects",
    icon: FolderOpen,
  },
  {
    title: "New Application",
    href: "/portal/projects/new",
    icon: Plus,
    highlight: true,
  },
];

const secondaryItems: NavItem[] = [
  {
    title: "Guidelines",
    href: "/portal/guidelines",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/portal/analytics",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    href: "/portal/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/portal/help",
    icon: HelpCircle,
  },
];

export default function PortalLayout({
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
              <Link href="/portal" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DSTI Portal</h1>
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
                const isActive = pathname === item.href || (item.href !== "/portal" && pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : item.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-600" : item.highlight ? "text-white" : "text-gray-500"
                    )} />
                    <span>{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
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
                      href={item.href as any}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Need Help?</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Our support team is here to assist you.
                    </p>
                    <Link 
                      href="/portal/help" 
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
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
