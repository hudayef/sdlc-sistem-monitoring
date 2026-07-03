import React from 'react';
import type { Project } from '../types';
import { Calendar, User, ArrowUpRight, Clock } from 'lucide-react';

interface DashboardCardProps {
  project: Project;
  progressPercent: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ project, progressPercent }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    } catch {
      return dateStr;
    }
  };

  const formatLastUpdate = (updateStr: string) => {
    try {
      const date = new Date(updateStr);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    } catch {
      return updateStr;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* Decorative top gradient glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="flex flex-col space-y-4">
        {/* Row 1: Badges and Last Update */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${getPriorityColor(project.priority)}`}>
              {project.priority} Priority
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <span className="flex items-center text-xs text-muted-foreground font-medium">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Update: {formatLastUpdate(project.lastUpdate)}
          </span>
        </div>

        {/* Row 2: Title and Description */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {project.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Row 3: Metadata Row */}
        <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4 sm:grid-cols-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Owner</span>
            <span className="mt-1 flex items-center text-sm font-semibold text-foreground">
              <User className="mr-1.5 h-4 w-4 text-muted-foreground" />
              {project.owner}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deadline</span>
            <span className="mt-1 flex items-center text-sm font-semibold text-foreground">
              <Calendar className="mr-1.5 h-4 w-4 text-muted-foreground" />
              {formatDate(project.deadline)}
            </span>
          </div>
        </div>

        {/* Row 4: Progress Bar */}
        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center justify-between text-sm font-semibold text-foreground mb-2">
            <span className="flex items-center">
              Progress Pengembangan
              <ArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
            </span>
            <span className="font-mono text-base">{progressPercent}%</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          {/* Unicode Text Representation (as requested in example: ████████░░ 80%) */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className={i < Math.round(progressPercent / 10) ? "text-primary" : "text-muted-foreground/30"}>
                  {i < Math.round(progressPercent / 10) ? '█' : '░'}
                </span>
              ))}
            </span>
            <span>Scale 1-10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
