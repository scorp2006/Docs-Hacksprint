"use client";

import { Card } from "../../ui/card";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Calendar, CheckCircle2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  teamMembers: TeamMember[];
}

export function TaskList({ tasks, teamMembers }: TaskListProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tasks</h2>
      {tasks.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No tasks yet. Create your first task to get started.
        </Card>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description}
                </p>
              </div>
              {task.assignee && (
                <Avatar>
                  <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                {task.status}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}