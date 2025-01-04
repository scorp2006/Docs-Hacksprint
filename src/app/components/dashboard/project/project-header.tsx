"use client";

import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Users, Plus, Settings } from "lucide-react";

interface ProjectHeaderProps {
  onAddMember: () => void;
  onCreateTask: () => void;
  teamMembers: TeamMember[];
}

export function ProjectHeader({ onAddMember, onCreateTask, teamMembers }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Marketing Campaign</h1>
        <p className="text-muted-foreground">
          Q2 Marketing initiatives and planning
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {teamMembers.map((member) => (
            <Avatar key={member.id} className="border-2 border-background">
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={onAddMember}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}