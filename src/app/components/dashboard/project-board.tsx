"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "../ui/card";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const initialColumns = {
  todo: {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "1", title: "Research competitors", description: "Analyze market leaders" },
      { id: "2", title: "Design mockups", description: "Create initial wireframes" },
    ],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    tasks: [
      { id: "3", title: "Update documentation", description: "Review and update API docs" },
    ],
  },
  review: {
    id: "review",
    title: "Review",
    tasks: [
      { id: "4", title: "Code review", description: "Review pull requests" },
    ],
  },
  done: {
    id: "done",
    title: "Done",
    tasks: [
      { id: "5", title: "Setup project", description: "Initialize repository" },
    ],
  },
};

export function ProjectBoard() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks,
      },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{column.title}</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3 min-h-[200px]"
                >
                  {column.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 cursor-grab active:cursor-grabbing"
                        >
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}