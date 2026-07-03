import React from 'react';
import { Layers, CheckCircle2, AlertCircle, HelpCircle, Percent } from 'lucide-react';

interface ProgressCardProps {
  totalStages: number;
  completedStages: number;
  inProgressStages: number;
  pendingStages: number;
  progressPercent: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  totalStages,
  completedStages,
  inProgressStages,
  pendingStages,
  progressPercent,
}) => {
  const stats = [
    {
      name: 'Total Tahapan',
      value: totalStages,
      description: 'Tahapan proses SDLC',
      icon: Layers,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/10',
    },
    {
      name: 'Tahapan Selesai',
      value: completedStages,
      description: 'Status: Completed',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
    },
    {
      name: 'Sedang Dikerjakan',
      value: inProgressStages,
      description: 'Status: In Progress',
      icon: AlertCircle,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/10',
    },
    {
      name: 'Belum Dimulai',
      value: pendingStages,
      description: 'Status: Pending',
      icon: HelpCircle,
      color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/10',
    },
    {
      name: 'Persentase Progress',
      value: `${progressPercent}%`,
      description: 'Berdasarkan checklist',
      icon: Percent,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.name}
              </span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </span>
            </div>
            <span className="mt-1 text-2xs text-muted-foreground truncate">
              {stat.description}
            </span>
          </div>
        );
      })}
    </div>
  );
};
