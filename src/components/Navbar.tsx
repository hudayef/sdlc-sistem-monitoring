import React, { useState } from 'react';
import type { Project, ProjectPriority } from '../types';
import { Moon, Sun, Plus, Check, ChevronDown, FolderKanban, X } from 'lucide-react';

interface NavbarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (
    name: string,
    description: string,
    owner: string,
    deadline: string,
    priority: ProjectPriority
  ) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  darkMode,
  onToggleDarkMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // New Project Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<ProjectPriority>('Medium');

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !owner || !deadline) return;
    onCreateProject(name, description, owner, deadline, priority);
    // Reset Form
    setName('');
    setDescription('');
    setOwner('');
    setDeadline('');
    setPriority('Medium');
    setModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & Project Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span className="hidden text-lg font-bold tracking-tight sm:block bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
              DevFlow
            </span>
          </div>

          <span className="h-5 w-px bg-border hidden sm:block" />

          {/* Project Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between space-x-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <span className="max-w-[120px] truncate sm:max-w-[200px]">
                {activeProject ? activeProject.name : 'Pilih Project'}
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 origin-top-left rounded-xl border border-border bg-popover p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none z-20 animate-in fade-in slide-in-from-top-1">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-border/50 mb-1">
                    Projects ({projects.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          onSelectProject(project.id);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                          project.id === activeProjectId
                            ? 'bg-muted font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <span className="truncate">{project.name}</span>
                        {project.id === activeProjectId && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border/50 mt-1.5 pt-1.5">
                    <button
                      onClick={() => {
                        setModalOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Buat Project Baru</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setModalOpen(true)}
            className="hidden items-center space-x-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all md:flex"
          >
            <Plus className="h-4 w-4" />
            <span>Project Baru</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shadow-sm text-foreground hover:bg-muted transition-all focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>
        </div>

      </div>

      {/* Modal - New Project Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all z-10 animate-in zoom-in-95">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">
              Buat Project Baru
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Nama Project
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: SaaS E-Commerce Platform"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Deskripsi singkat mengenai software yang dikembangkan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Product Owner
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Owner / PM"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <div className="flex items-center space-x-2">
                  {(['Low', 'Medium', 'High'] as ProjectPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-all ${
                        priority === p
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors"
                >
                  Buat Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
