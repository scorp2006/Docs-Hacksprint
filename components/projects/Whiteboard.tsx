'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paintbrush, Eraser, Undo, Trash2, Square, Circle, Type } from 'lucide-react';

interface WhiteboardProps {
  projectId: string;
}

type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';

const COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'
];

export function Whiteboard({ projectId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastDrawnState = useRef<ImageData | null>(null);

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

    // Save initial state
    saveState();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDrawing(true);

    if (tool === 'pen' || tool === 'eraser') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    } else {
      // Save the current state before starting to draw a shape
      lastDrawnState.current = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current || !startPos) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen' || tool === 'eraser') {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    } else {
      // Restore the last drawn state before drawing the new preview
      if (lastDrawnState.current) {
        contextRef.current.putImageData(lastDrawnState.current, 0, 0);
      }

      // Draw the shape preview
      contextRef.current.beginPath();
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;

      if (tool === 'rectangle') {
        const width = x - startPos.x;
        const height = y - startPos.y;
        contextRef.current.rect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        contextRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      }

      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (!contextRef.current || !isDrawing) return;

    if (tool === 'pen' || tool === 'eraser') {
      contextRef.current.closePath();
    }
    
    // Save the state after drawing is complete
    saveState();
    setIsDrawing(false);
    setStartPos(null);
    lastDrawnState.current = null;
  };

  const saveState = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const imageData = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (!contextRef.current || !canvasRef.current || historyIndex < 0) return;
    
    const newIndex = historyIndex - 1;
    if (newIndex >= 0) {
      contextRef.current.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    } else {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHistoryIndex(-1);
    }
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory([]);
    setHistoryIndex(-1);
    lastDrawnState.current = null;
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
          onClick={undo}
          disabled={historyIndex < 0}
        >
          <Undo className="h-4 w-4 mr-1" />
          Undo
        </Button>
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