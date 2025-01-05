'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase/hooks/useAuth';
import { getAllProjects } from '@/firebase/services/projectService';
import { Project } from '@/types/project';
import { NewProjectDialog } from './NewProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface ProjectGridProps {
  emptyMessage?: string;
}

export function ProjectGrid({ emptyMessage = 'No projects found.' }: ProjectGridProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      if (user) {
        try {
          const userProjects = await getAllProjects(user.uid);
          setProjects(userProjects);
        } catch (error) {
          console.error('Error loading projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 mb-6">{emptyMessage}</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block group"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                  {project.name}
                </h3>
                <p className="text-gray-600 line-clamp-2">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <NewProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onProjectCreated={(newProject) => {
          setProjects((prev) => [...prev, newProject]);
          setDialogOpen(false);
        }}
      />
    </div>
  );
} 