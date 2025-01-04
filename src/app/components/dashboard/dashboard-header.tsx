"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";

interface DashboardHeaderProps {
  projects: Project[];
}

export function DashboardHeader({ projects }: DashboardHeaderProps) {
  const stats = [
    {
      title: "Total Projects",
      value: projects.length.toString(),
      icon: ListTodo,
      trend: "+1",
    },
    {
      title: "In Progress",
      value: "0",
      icon: Clock,
      trend: "0",
    },
    {
      title: "Completed",
      value: "0",
      icon: CheckCircle2,
      trend: "0",
    },
    {
      title: "Overall Progress",
      value: "0%",
      icon: TrendingUp,
      trend: "0",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stat.trend}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}