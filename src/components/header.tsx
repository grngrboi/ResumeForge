'use client';

import { Button } from '@/components/ui/button';
import { Download, RotateCcw } from 'lucide-react';

export function AppHeader({ onReset }: { onReset: () => void }) {
  const handleDownload = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 no-print">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">
          <span className="font-headline">ResumeForge</span>
        </h1>
      </div>
      <div className='flex gap-2'>
         <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </header>
  );
}
