'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  children: React.ReactNode;
  preview: React.ReactNode;
};

export default function BenefitTooltip({ children, preview }: Props) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span className="cursor-help underline decoration-dotted decoration-white/25 underline-offset-4 hover:decoration-[var(--accent)]/60 transition-colors">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="flex flex-col items-center gap-2 py-1">
          {preview}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
