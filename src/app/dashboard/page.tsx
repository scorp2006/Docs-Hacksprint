"use client";

import { useState } from "react";
import { ProjectList } from "../components/dashboard/project-list";
import { DashboardHeader } from "../components/dashboard/dashboard-header";
import { CreateProjectDialog } from "../components/dashboard/create-project-dialog";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleCreateProject = (project: Project) => {
    setProjects([...projects, { ...project, id: Date.now() }]);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader projects={projects} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <ProjectList projects={projects} />
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}