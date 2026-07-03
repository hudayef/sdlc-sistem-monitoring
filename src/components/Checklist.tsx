import React, { useState } from 'react';
import type { SDLCStage } from '../types';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

interface ChecklistProps {
  stage: SDLCStage;
  onToggleItem: (stageId: string, itemId: string) => void;
  onAddItem: (stageId: string, taskText: string) => void;
  onDeleteItem: (stageId: string, itemId: string) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({
  stage,
  onToggleItem,
  onAddItem,
  onDeleteItem,
}) => {
  const [newItemText, setNewItemText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(stage.id, newItemText.trim());
    setNewItemText('');
  };

  const completedCount = stage.checklist.filter((item) => item.completed).length;
  const totalCount = stage.checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tahap SDLC Checklist
            </span>
            <h3 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
              {stage.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border/55 px-2.5 py-1 rounded-md">
              {completedCount}/{totalCount} Selesai
            </span>
            <span className="text-xs font-mono font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-1 rounded-md">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Form to Add Checklist Item */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Tambah butir checklist baru..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow hover:bg-primary/95 transition-all"
            aria-label="Add item"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>

        {/* Checklist Items List */}
        {stage.checklist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <p className="text-sm">Tidak ada butir checklist untuk tahap ini.</p>
            <p className="text-xs mt-1">Tambah tugas di atas untuk memulai pelacakan.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {stage.checklist.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 transition-all hover:bg-muted/40"
              >
                <button
                  type="button"
                  onClick={() => onToggleItem(stage.id, item.id)}
                  className="flex flex-1 items-start text-left space-x-3 focus:outline-none"
                >
                  <div className="shrink-0 mt-0.5">
                    {item.completed ? (
                      <CheckSquare className="h-4.5 w-4.5 text-primary" />
                    ) : (
                      <Square className="h-4.5 w-4.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                    )}
                  </div>
                  <span
                    className={`text-sm leading-tight transition-all duration-200 break-all select-none ${
                      item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {item.task}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteItem(stage.id, item.id)}
                  className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  aria-label="Hapus item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
