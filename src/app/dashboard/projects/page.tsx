"use client";

import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { CreateProjectDialog } from "../../components/dashboard/create-project-dialog";
import { useState } from "react";

export default function ProjectsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-12 rounded-lg border-2 border-dashed text-center">
          <h2 className="text-xl font-medium mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to get started
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}