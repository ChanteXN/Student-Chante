import Link from "next/link";
import { cn } from "@/lib/utils";
import { Route } from "next";

interface SidebarProps {
  items: {
    href: Route | string;
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
  }[];
  header?: React.ReactNode;
}

export function Sidebar({ items, header }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      {header && <div className="p-6 border-b">{header}</div>}
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href as Route}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
