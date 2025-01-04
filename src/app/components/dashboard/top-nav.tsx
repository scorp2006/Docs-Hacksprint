"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Bell,
  Search,
  MessageSquare,
  UserCircle,
} from "lucide-react";

export function TopNav() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="w-full bg-muted"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}