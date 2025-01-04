"use client";

import { cn } from "../../lib/utils";
import {
  Home,
  FolderKanban,
  Users,
  Settings,
  CheckSquare,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r bg-card">
      <div className="p-4">
        <div className="flex items-center gap-2 px-2">
          <FolderKanban className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">IdeaBoard</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}