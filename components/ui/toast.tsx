'use client';

import { useToast } from './use-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2 rounded-lg p-4 shadow-lg',
            toast.variant === 'destructive'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-900'
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => {
              // The toast will be removed automatically by the timeout
            }}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
} 