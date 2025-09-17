'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const clamped = Math.max(0, Math.min(value ?? 0, safeMax));
    const pct = (clamped / safeMax) * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={Math.round(pct)}
        className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
