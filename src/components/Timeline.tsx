import React from 'react';
import type { SDLCStage } from '../types';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';

interface TimelineProps {
  stages: SDLCStage[];
  activeStageId: string;
  onSelectStage: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ stages, activeStageId, onSelectStage }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10 shrink-0" />;
      case 'In Progress':
        return <PlayCircle className="h-5 w-5 text-amber-500 fill-amber-500/10 shrink-0 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />;
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-500 font-semibold';
      case 'In Progress':
        return 'text-amber-500 font-semibold';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative pl-4">
      {/* Central Timeline Line */}
      <div className="absolute left-[26px] top-2 bottom-2 w-0.5 bg-border z-0" />

      <div className="space-y-4 relative z-10">
        {stages.map((stage, idx) => {
          const isActive = stage.id === activeStageId;
          const completedCount = stage.checklist.filter((c) => c.completed).length;
          const totalCount = stage.checklist.length;
          const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`w-full text-left flex items-start space-x-4 rounded-xl p-3.5 border transition-all duration-200 outline-none ${
                isActive
                  ? 'border-primary bg-card/80 shadow-md ring-1 ring-ring/10'
                  : 'border-border/50 bg-card/40 hover:bg-muted/30 hover:border-border'
              }`}
            >
              {/* Left Column: Number / Status Icon */}
              <div className="flex flex-col items-center justify-center shrink-0 mt-0.5">
                {getStatusIcon(stage.status)}
                <span className="mt-1 text-2xs font-bold font-mono text-muted-foreground/60">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Right Column: Stage Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h4 className="text-sm font-bold tracking-tight text-foreground truncate">
                    {stage.name}
                  </h4>
                  <span className={`text-2xs uppercase tracking-wider font-mono font-bold ${getStatusColorClass(stage.status)}`}>
                    {stage.status}
                  </span>
                </div>

                {/* Micro checklist progress bar */}
                {totalCount > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted shrink-0">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          stage.status === 'Completed'
                            ? 'bg-emerald-500'
                            : stage.status === 'In Progress'
                            ? 'bg-amber-500'
                            : 'bg-muted-foreground/30'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <span className="text-2xs font-mono font-medium text-muted-foreground/80">
                      {completedCount}/{totalCount} ({completionRate}%)
                    </span>
                  </div>
                )}

                {/* Short notes snippet */}
                {stage.notes && (
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1 italic">
                    "{stage.notes}"
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
