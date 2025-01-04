'use client';

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Project, Task } from '@/types'
import { TaskBoard } from '@/components/projects/TaskBoard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import dynamic from 'next/dynamic'

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

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    const mockProject: Project = {
      id: params.id as string,
      name: 'Sample Project',
      description: 'This is a sample project description that explains what this project is about and what we aim to achieve.',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const mockTasks: Task[] = [
      {
        id: '1',
        projectId: params.id as string,
        title: 'Task 1',
        description: 'This is task 1',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0
      },
      {
        id: '2',
        projectId: params.id as string,
        title: 'Task 2',
        description: 'This is task 2',
        status: 'in-progress',
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0
      }
    ]

    setProject(mockProject)
    setTasks(mockTasks)
    setLoading(false)
  }, [params.id])

  const handleCreateTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...task,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: tasks.length
    }
    setTasks([...tasks, newTask])
  }

  const handleTaskMove = (taskId: string, sourceCol: string, destCol: string, newOrder: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: destCol as Task['status'],
          order: newOrder,
          updatedAt: new Date()
        }
      }
      return task
    })
    setTasks(updatedTasks)
  }

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
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <p className="text-gray-600 max-w-2xl">{project.description}</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="mr-2 h-4 w-4" />
                Created {project.createdAt.toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <TaskBoard
              projectId={project.id}
              initialTasks={tasks}
              onTaskCreate={handleCreateTask}
              onTaskMove={handleTaskMove}
            />
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
        </Tabs>
      </div>
    </div>
  )
} 