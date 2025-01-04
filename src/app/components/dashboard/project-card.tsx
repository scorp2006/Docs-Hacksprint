"use client";

import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Calendar, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description: string;
    progress: number;
    dueDate: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <Link href={`/dashboard/project/${project.id}`}>
          <h3 className="font-semibold hover:text-primary">{project.name}</h3>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <Progress value={project.progress} />
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
}