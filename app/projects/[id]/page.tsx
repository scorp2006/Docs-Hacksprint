'use client';

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Project, Task } from '@/types'
import { TaskBoard } from '@/components/projects/TaskBoard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/firebase/hooks/useAuth'

// Import Excalidraw dynamically to avoid SSR issues
const Whiteboard = dynamic(
  () => import('@/components/projects/Whiteboard').then((mod) => mod.Whiteboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[500px]">
        Loading whiteboard...
      </div>
    ),
  }
)

// Import ProjectMembers component
const ProjectMembers = dynamic(
  () => import('@/components/projects/ProjectMembers'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[200px]">
        Loading members...
      </div>
    ),
  }
)

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;

    // Mock data for now
    const mockProject: Project = {
      id: params.id as string,
      name: 'Sample Project',
      description: 'This is a sample project description that explains what this project is about and what we aim to achieve.',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.uid,
      members: [user.uid],
      status: 'active'
    }

    setProject(mockProject)
    setLoading(false)
  }, [params.id, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Project not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.push('/')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Projects
                  </Button>
                </div>
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <p className="text-gray-600 max-w-2xl">{project.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Created {project.createdAt.toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <TaskBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="whiteboard">
            <Card>
              <CardContent className="pt-6">
                <div className="h-[600px] w-full">
                  <Whiteboard projectId={project.id} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardContent className="pt-6">
                <ProjectMembers project={project} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 