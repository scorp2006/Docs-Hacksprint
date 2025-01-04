"use client";

import { Card } from "../../components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

export default function TasksPage() {
  const tasks = [
    {
      id: 1,
      title: "Research competitors",
      project: "Marketing Campaign",
      dueDate: "2024-04-15",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Design mockups",
      project: "Website Redesign",
      dueDate: "2024-04-20",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Tasks</h1>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.project}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div
                  className={`flex items-center text-sm ${
                    task.status === "Completed"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {task.status}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}