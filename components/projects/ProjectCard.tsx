'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  id: string
  name: string
  description: string
  createdAt: Date
}

export function ProjectCard({ id, name, description, createdAt }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <Link href={`/projects/${id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {description || 'No description provided'}
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Created {formatDate(createdAt)}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 