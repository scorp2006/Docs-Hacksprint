'use client';

import { useState, useRef, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Task } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { NewTaskDialog } from './NewTaskDialog'
import { Badge } from '@/components/ui/badge'
import { Clock, MoreVertical } from 'lucide-react'
import { taskService } from '@/firebase/services/taskService'
import { useAuth } from '@/firebase/hooks/useAuth'

interface Column {
  id: string
  title: string
  tasks: Task[]
  color: string
}

interface TaskBoardProps {
  projectId: string
}

interface DragItem {
  id: string
  index: number
  columnId: string
  type: string
}

const TaskItem = ({ task, index, columnId, onMove }: {
  task: Task
  index: number
  columnId: string
  onMove: (dragIndex: number, hoverIndex: number, sourceCol: string, targetCol: string) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, index, columnId, type: 'TASK' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop<DragItem>({
    accept: 'TASK',
    hover: (item, monitor) => {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index
      const sourceCol = item.columnId
      const targetCol = columnId

      if (dragIndex === hoverIndex && sourceCol === targetCol) return

      onMove(dragIndex, hoverIndex, sourceCol, targetCol)
      item.index = hoverIndex
      item.columnId = targetCol
    },
  })

  drag(drop(ref))

  const timeSinceCreation = () => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div
      ref={ref}
      className={`group p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{task.title}</h3>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {timeSinceCreation()}
        </div>
        <Badge variant="secondary" className="text-xs">
          {columnId}
        </Badge>
      </div>
    </div>
  )
}

const DropZone = ({ columnId, onDrop }: { columnId: string, onDrop: (sourceCol: string, targetCol: string, index: number) => void }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: DragItem) => {
      if (item.columnId !== columnId) {
        onDrop(item.columnId, columnId, 0)
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={`h-full min-h-[200px] w-full rounded-lg ${
        isOver ? 'bg-muted/50' : ''
      }`}
    />
  )
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const { user } = useAuth();
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [],
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [],
      color: 'bg-yellow-500/10 text-yellow-500'
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [],
      color: 'bg-green-500/10 text-green-500'
    }
  ]);

  useEffect(() => {
    // Subscribe to real-time task updates
    const unsubscribe = taskService.subscribeToProjectTasks(projectId, (tasks) => {
      const newColumns = columns.map(col => ({
        ...col,
        tasks: tasks
          .filter(task => task.status === col.id)
          .sort((a, b) => a.order - b.order)
      }));
      setColumns(newColumns);
    });

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  const handleMove = async (dragIndex: number, hoverIndex: number, sourceCol: string, targetCol: string) => {
    const sourceColumn = columns.find(col => col.id === sourceCol);
    const targetColumn = columns.find(col => col.id === targetCol);

    if (!sourceColumn || !targetColumn) return;

    const sourceTasks = Array.from(sourceColumn.tasks);
    const targetTasks = sourceCol === targetCol ? sourceTasks : Array.from(targetColumn.tasks);

    const [movedTask] = sourceTasks.splice(dragIndex, 1);
    targetTasks.splice(hoverIndex, 0, {
      ...movedTask,
      status: targetCol as Task['status']
    });

    const newColumns = columns.map(col => {
      if (col.id === sourceCol) {
        return { ...col, tasks: sourceTasks };
      }
      if (col.id === targetCol) {
        return { ...col, tasks: targetTasks };
      }
      return col;
    });

    setColumns(newColumns);

    // Update task orders in Firestore
    const updatedTasks = targetTasks.map((task, index) => ({
      id: task.id,
      order: index,
      status: targetCol as Task['status']
    }));

    try {
      await taskService.updateTasksOrder(updatedTasks);
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };

  const handleEmptyColumnDrop = async (sourceCol: string, targetCol: string, index: number) => {
    const sourceColumn = columns.find(col => col.id === sourceCol);
    const targetColumn = columns.find(col => col.id === targetCol);

    if (!sourceColumn || !targetColumn) return;

    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(index, 1);

    const newColumns = columns.map(col => {
      if (col.id === sourceCol) {
        return { ...col, tasks: sourceTasks };
      }
      if (col.id === targetCol) {
        return { ...col, tasks: [{ ...movedTask, status: targetCol as Task['status'] }] };
      }
      return col;
    });

    setColumns(newColumns);

    try {
      await taskService.updateTasksOrder([{
        id: movedTask.id,
        order: 0,
        status: targetCol as Task['status']
      }]);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleCreateTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    if (!user) return;

    try {
      await taskService.createTask({
        ...task,
        order: columns.find(col => col.id === 'todo')?.tasks.length || 0
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="text-sm text-muted-foreground">
              Manage and track project tasks
            </p>
          </div>
          <NewTaskDialog projectId={projectId} onTaskCreate={handleCreateTask} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Badge variant="secondary" className={`mr-2 ${column.color}`}>
                        {column.tasks.length}
                      </Badge>
                      {column.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {column.tasks.map((task, index) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={index}
                        columnId={column.id}
                        onMove={handleMove}
                      />
                    ))}
                    {column.tasks.length === 0 && (
                      <DropZone
                        columnId={column.id}
                        onDrop={handleEmptyColumnDrop}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
} 