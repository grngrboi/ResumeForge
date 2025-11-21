'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Button } from './ui/button';

export function DndSection({ id, children }: { id: string, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Button
        variant="ghost"
        className="absolute top-4 right-4 h-8 w-8 p-0 cursor-grab active:cursor-grabbing touch-none"
        {...listeners}
        {...attributes}
      >
        <GripVertical />
      </Button>
      {children}
    </div>
  );
}
