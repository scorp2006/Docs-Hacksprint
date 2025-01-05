'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paintbrush, Eraser, Undo, Trash2, Square, Circle, Type } from 'lucide-react';
import { whiteboardService } from '@/firebase/services/whiteboardService';
import { useAuth } from '@/firebase/hooks/useAuth';
import { WhiteboardElement } from '@/types';

interface WhiteboardProps {
  projectId: string;
}

type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';

const COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'
];

export function Whiteboard({ projectId }: WhiteboardProps) {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPath = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Get context
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set default styles
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    contextRef.current = context;

    // Subscribe to real-time updates
    const unsubscribe = whiteboardService.subscribeToProjectElements(projectId, (updatedElements) => {
      setElements(updatedElements);
      redrawCanvas(updatedElements, context);
    });

    // Load initial elements
    whiteboardService.getProjectElements(projectId).then(setElements);

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  const redrawCanvas = (elements: WhiteboardElement[], context: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;
    
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    elements.forEach(element => {
      context.beginPath();
      context.strokeStyle = element.style?.color || '#000000';
      context.lineWidth = element.style?.size || 2;

      if (element.type === 'drawing') {
        const points = element.content as { x: number; y: number }[];
        if (points.length > 0) {
          context.moveTo(points[0].x, points[0].y);
          points.slice(1).forEach((point: { x: number; y: number }) => {
            context.lineTo(point.x, point.y);
          });
        }
      } else if (element.type === 'rectangle') {
        const { width, height } = element.content as { width: number; height: number };
        context.rect(element.position.x, element.position.y, width, height);
      } else if (element.type === 'circle') {
        const { radius } = element.content as { radius: number };
        context.arc(element.position.x, element.position.y, radius, 0, 2 * Math.PI);
      }

      context.stroke();
      context.closePath();
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current || !user) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    currentPath.current = [{ x, y }];

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentPath.current.push({ x, y });
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = async () => {
    if (!isDrawing || !contextRef.current || !user || currentPath.current.length === 0) return;

    const newElement: Omit<WhiteboardElement, 'id' | 'createdAt' | 'updatedAt'> = {
      type: 'drawing',
      content: currentPath.current,
      position: { x: 0, y: 0 },
      style: {
        color,
        size: lineWidth
      },
      createdBy: user.uid,
      projectId
    };

    try {
      await whiteboardService.createElement(newElement);
    } catch (error) {
      console.error('Error saving drawing:', error);
    }

    setIsDrawing(false);
    currentPath.current = [];
    contextRef.current.closePath();
  };

  const clearCanvas = async () => {
    if (!contextRef.current || !canvasRef.current || !user) return;

    try {
      // Delete all elements
      const deletePromises = elements.map(element => whiteboardService.deleteElement(element.id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing canvas:', error);
    }
  };

  const updateTool = (newTool: Tool) => {
    if (!contextRef.current) return;
    setTool(newTool);
    contextRef.current.strokeStyle = newTool === 'eraser' ? '#ffffff' : color;
    contextRef.current.lineWidth = newTool === 'eraser' ? 20 : lineWidth;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b flex-wrap">
        <Button
          variant={tool === 'pen' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateTool('pen')}
        >
          <Paintbrush className="h-4 w-4 mr-1" />
          Pen
        </Button>
        <Button
          variant={tool === 'eraser' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateTool('eraser')}
        >
          <Eraser className="h-4 w-4 mr-1" />
          Eraser
        </Button>
        <Button
          variant={tool === 'rectangle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateTool('rectangle')}
        >
          <Square className="h-4 w-4 mr-1" />
          Rectangle
        </Button>
        <Button
          variant={tool === 'circle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateTool('circle')}
        >
          <Circle className="h-4 w-4 mr-1" />
          Circle
        </Button>
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border-2 ${
                color === c ? 'border-gray-400' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                if (contextRef.current && tool !== 'eraser') {
                  contextRef.current.strokeStyle = c;
                }
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setLineWidth(value);
              if (contextRef.current && tool !== 'eraser') {
                contextRef.current.lineWidth = value;
              }
            }}
            className="w-24"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
} 