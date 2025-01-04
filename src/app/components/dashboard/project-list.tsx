"use client";

import { ProjectCard } from "./project-card";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-12 rounded-lg border-2 border-dashed text-center">
          <h2 className="text-xl font-medium mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to get started
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}