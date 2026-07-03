import React, { useState, useEffect } from 'react';
import type { Project, ProjectPriority } from '../types';
import { Calendar, User, ShieldAlert, Award, FileText, Edit3, Check, X, Trash2 } from 'lucide-react';

interface ProjectInfoProps {
  project: Project;
  progressPercent: number;
  onUpdateProjectInfo: (
    projectId: string,
    updatedFields: Partial<Omit<Project, 'id' | 'stages' | 'documents'>>
  ) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({
  project,
  progressPercent,
  onUpdateProjectInfo,
  onDeleteProject,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(project.description);
  const [owner, setOwner] = useState(project.owner);
  const [deadline, setDeadline] = useState(project.deadline);
  const [priority, setPriority] = useState<ProjectPriority>(project.priority);

  // Sync edits if project changes
  useEffect(() => {
    setDescription(project.description);
    setOwner(project.owner);
    setDeadline(project.deadline);
    setPriority(project.priority);
    setIsEditing(false);
  }, [project]);

  const handleSave = () => {
    onUpdateProjectInfo(project.id, {
      description,
      owner,
      deadline,
      priority,
    });
    setIsEditing(false);
  };

  const getPriorityBadgeClass = (p: string) => {
    switch (p) {
      case 'High':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Detail Informasi
            </span>
            <h3 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
              Project Information
            </h3>
          </div>

          {!isEditing ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/50 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Edit Info</span>
              </button>
              <button
                onClick={() => onDeleteProject(project.id)}
                className="flex items-center space-x-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-500 shadow-sm hover:bg-red-500/10 hover:border-red-500/30 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Project</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Simpan</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setDescription(project.description);
                  setOwner(project.owner);
                  setDeadline(project.deadline);
                  setPriority(project.priority);
                }}
                className="flex items-center space-x-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/50 transition-all"
              >
                <X className="h-3.5 w-3.5" />
                <span>Batal</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start space-x-3 rounded-xl border border-border/50 bg-muted/5 p-4">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Product Owner / Manager</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{project.owner}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-xl border border-border/50 bg-muted/5 p-4">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Deadline Target</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {new Date(project.deadline).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-xl border border-border/50 bg-muted/5 p-4">
                <ShieldAlert className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Prioritas Project</p>
                  <span className={`inline-block mt-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${getPriorityBadgeClass(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-xl border border-border/50 bg-muted/5 p-4">
                <Award className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Pencapaian Progress</p>
                  <p className="text-sm font-bold text-foreground mt-0.5 font-mono">{progressPercent}% selesai</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/5 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4.5 w-4.5 text-muted-foreground" />
                <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Deskripsi Project</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description || 'Tidak ada deskripsi untuk project ini.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Product Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Prioritas
                </label>
                <div className="flex items-center space-x-2">
                  {(['Low', 'Medium', 'High'] as ProjectPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-all ${
                        priority === p
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
