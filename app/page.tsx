'use client'

import { useEffect, useState } from 'react'
import { NewProjectDialog } from '@/components/projects/NewProjectDialog'
import { ProjectCard } from '@/components/projects/ProjectCard'

interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for now
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Project 1',
        description: 'This is a sample project',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2', 
        name: 'Project 2',
        description: 'Another sample project',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    setProjects(mockProjects)
    setLoading(false)
  }, [])

  const handleCreateProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setProjects([...projects, newProject])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <NewProjectDialog onProjectCreate={handleCreateProject} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            description={project.description}
            createdAt={project.createdAt}
          />
        ))}
      </div>
    </div>
  )
}
