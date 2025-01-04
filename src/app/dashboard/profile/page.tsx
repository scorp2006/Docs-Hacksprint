"use client";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { UserCircle, Mail, Building } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-muted rounded-full">
            <UserCircle className="h-16 w-16" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-muted-foreground">Product Manager</p>
          </div>
          <Button>Edit Profile</Button>
        </div>
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="flex">
                <Input defaultValue="John Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="flex">
                <Input defaultValue="john@example.com" type="email" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <div className="flex">
                <Input defaultValue="Product Manager" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <div className="flex">
                <Input defaultValue="Acme Inc" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}