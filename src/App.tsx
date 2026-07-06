import { useState, useEffect, useMemo } from 'react';
import type { Project, SDLCStage, ChecklistItem, StageStatus, ProjectPriority, ProjectStatus } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardCard } from './components/DashboardCard';
import { ProgressCard } from './components/ProgressCard';
import { Timeline } from './components/Timeline';
import { Checklist } from './components/Checklist';
import { Notes } from './components/Notes';
import { Documents } from './components/Documents';
import { ProjectInfo } from './components/ProjectInfo';
import { Footer } from './components/Footer';
import initialProjectsData from './data/projects.json';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Sparkles, Milestone, ClipboardList, PenTool } from 'lucide-react';

// Cast JSON mock data to Project types
const typedInitialProjects = initialProjectsData as unknown as Project[];

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [activeStageId, setActiveStageId] = useState<string>('business_idea');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // 1. Initial State Load
  useEffect(() => {
    // Theme load
    const savedTheme = localStorage.getItem('devflow_theme');
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Projects load
    const loadProjects = async () => {
      if (isSupabaseConfigured && supabase) {
        console.log("DevFlow: Loading data from Supabase...");
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('id', { ascending: true });

          if (error) {
            console.error("Supabase Error:", {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw error;
          }

          if (data && data.length > 0) {
            setProjects(data as Project[]);
            setActiveProjectId(data[0].id);
            return;
          } else {
            // Seed database if it's empty
            console.log("DevFlow: Supabase database is empty. Seeding with default data...");
            const { error: seedError } = await supabase
              .from('projects')
              .insert(typedInitialProjects);

            if (seedError) {
              console.error("Supabase Error:", {
                message: seedError.message,
                details: seedError.details,
                hint: seedError.hint,
                code: seedError.code
              });
              throw seedError;
            }
            setProjects(typedInitialProjects);
            setActiveProjectId(typedInitialProjects[0].id);
            return;
          }
        } catch (err) {
          console.error("DevFlow: Gagal memuat dari Supabase. Fallback ke Local Storage.", err);
        }
      }

      // Fallback: Local Storage
      console.log("DevFlow: Loading data from Local Storage...");
      const savedProjects = localStorage.getItem('devflow_projects');
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects) as Project[];
          if (parsed.length > 0) {
            setProjects(parsed);
            setActiveProjectId(parsed[0].id);
          } else {
            setProjects(typedInitialProjects);
            setActiveProjectId(typedInitialProjects[0].id);
          }
        } catch {
          setProjects(typedInitialProjects);
          setActiveProjectId(typedInitialProjects[0].id);
        }
      } else {
        setProjects(typedInitialProjects);
        setActiveProjectId(typedInitialProjects[0].id);
        localStorage.setItem('devflow_projects', JSON.stringify(typedInitialProjects));
      }
    };

    loadProjects();
  }, []);

  // 2. Active Project
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // 3. Active Stage
  const activeStage = useMemo(() => {
    if (!activeProject) return null;
    return activeProject.stages.find((s) => s.id === activeStageId) || activeProject.stages[0];
  }, [activeProject, activeStageId]);

  // 4. Calculate Stats dynamically for active project
  const stats = useMemo(() => {
    if (!activeProject) {
      return {
        totalStages: 0,
        completedStages: 0,
        inProgressStages: 0,
        pendingStages: 0,
        progressPercent: 0,
      };
    }

    const totalStages = activeProject.stages.length;
    const completedStages = activeProject.stages.filter((s) => s.status === 'Completed').length;
    const inProgressStages = activeProject.stages.filter((s) => s.status === 'In Progress').length;
    const pendingStages = activeProject.stages.filter((s) => s.status === 'Pending').length;

    // Checklists progress calculation
    let totalChecklistItems = 0;
    let completedChecklistItems = 0;

    activeProject.stages.forEach((stage) => {
      totalChecklistItems += stage.checklist.length;
      completedChecklistItems += stage.checklist.filter((item) => item.completed).length;
    });

    const progressPercent =
      totalChecklistItems > 0
        ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
        : 0;

    return {
      totalStages,
      completedStages,
      inProgressStages,
      pendingStages,
      progressPercent,
    };
  }, [activeProject]);

  // 5. Update State and Database sync helper
  const saveProjectsState = async (
    updatedProjects: Project[],
    projectId: string,
    action: 'insert' | 'update' | 'delete',
    singleProject?: Project
  ) => {
    // 1. Always update Local Storage as local copy/cache
    localStorage.setItem('devflow_projects', JSON.stringify(updatedProjects));

    // 2. Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        if (action === 'insert' && singleProject) {
          const { error } = await supabase.from('projects').insert([singleProject]);
          if (error) {
            console.error("Supabase Error (insert):", {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw error;
          }
        } else if (action === 'delete') {
          const { error } = await supabase.from('projects').delete().eq('id', projectId);
          if (error) {
            console.error("Supabase Error (delete):", {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw error;
          }
        } else if (action === 'update') {
          const target = updatedProjects.find(p => p.id === projectId);
          if (target) {
            const { error } = await supabase
              .from('projects')
              .update({
                name: target.name,
                description: target.description,
                owner: target.owner,
                deadline: target.deadline,
                priority: target.priority,
                status: target.status,
                lastUpdate: target.lastUpdate,
                documents: target.documents,
                stages: target.stages,
              })
              .eq('id', projectId);
            if (error) {
              console.error("Supabase Error (update):", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
              });
              throw error;
            }
          }
        }
      } catch (err) {
        console.error(`DevFlow: Supabase sync error (${action}):`, err);
      }
    }
  };

  // Helper to recalculate stage & project status based on checklist
  const updateProjectStatuses = (project: Project): Project => {
    const updatedStages = project.stages.map((stage) => {
      if (stage.checklist.length === 0) return stage;
      
      const completedCount = stage.checklist.filter((c) => c.completed).length;
      let nextStatus: StageStatus = 'Pending';
      
      if (completedCount === stage.checklist.length) {
        nextStatus = 'Completed';
      } else if (completedCount > 0) {
        nextStatus = 'In Progress';
      }

      return {
        ...stage,
        status: nextStatus,
      };
    });

    // Determine Project status based on stages
    let nextProjectStatus: ProjectStatus = 'Pending';
    const completedCount = updatedStages.filter((s) => s.status === 'Completed').length;
    const inProgressCount = updatedStages.filter((s) => s.status === 'In Progress').length;

    if (completedCount === updatedStages.length) {
      nextProjectStatus = 'Completed';
    } else if (completedCount > 0 || inProgressCount > 0) {
      nextProjectStatus = 'In Progress';
    }

    return {
      ...project,
      status: nextProjectStatus,
      stages: updatedStages,
      lastUpdate: new Date().toISOString(),
    };
  };

  // 6. Action Handlers
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('devflow_theme', nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleCreateProject = (
    name: string,
    description: string,
    owner: string,
    deadline: string,
    priority: ProjectPriority
  ) => {
    // Generate default stages template with ID prefix
    const defaultStagesTemplate: SDLCStage[] = [
      { id: 'business_idea', name: 'Business Idea', status: 'Pending', notes: '', checklist: [
        { id: 'bi-t1', task: 'Riset ide bisnis & segmentasi produk', completed: false },
        { id: 'bi-t2', task: 'Formulasi Unique Value Proposition (UVP)', completed: false }
      ]},
      { id: 'market_research', name: 'Market Research', status: 'Pending', notes: '', checklist: [
        { id: 'mr-t1', task: 'Analisis kompetitor industri', completed: false },
        { id: 'mr-t2', task: 'Kuesioner/Survei ekspektasi calon pengguna', completed: false }
      ]},
      { id: 'requirement_analysis', name: 'Requirement Analysis', status: 'Pending', notes: '', checklist: [
        { id: 'ra-t1', task: 'Interview stakeholder/klien utama', completed: false },
        { id: 'ra-t2', task: 'Pembuatan daftar kebutuhan fungsional sistem', completed: false }
      ]},
      { id: 'srs', name: 'Software Requirement Specification (SRS)', status: 'Pending', notes: '', checklist: [
        { id: 'srs-t1', task: 'Penyusunan dokumen teknis spesifikasi software', completed: false },
        { id: 'srs-t2', task: 'Review & approval tim developer & klien', completed: false }
      ]},
      { id: 'prd', name: 'Product Requirement Document (PRD)', status: 'Pending', notes: '', checklist: [
        { id: 'prd-t1', task: 'Definisi ruang lingkup rilis MVP', completed: false },
        { id: 'prd-t2', task: 'Metrik keberhasilan performa produk', completed: false }
      ]},
      { id: 'user_flow', name: 'User Flow', status: 'Pending', notes: '', checklist: [
        { id: 'uf-t1', task: 'Pemetaan navigasi perjalanan user (flow chart)', completed: false }
      ]},
      { id: 'wireframe', name: 'Wireframe', status: 'Pending', notes: '', checklist: [
        { id: 'wf-t1', task: 'Sketsa hitam putih tata letak antarmuka utama', completed: false }
      ]},
      { id: 'ui_design', name: 'UI Design', status: 'Pending', notes: '', checklist: [
        { id: 'ui-t1', task: 'Pembuatan desain visual high-fidelity di Figma', completed: false }
      ]},
      { id: 'design_system', name: 'Design System', status: 'Pending', notes: '', checklist: [
        { id: 'ds-t1', task: 'Definisi warna, font, grid style token', completed: false },
        { id: 'ds-t2', task: 'Katalog reusable component UI', completed: false }
      ]},
      { id: 'database_design', name: 'Database Design', status: 'Pending', notes: '', checklist: [
        { id: 'db-t1', task: 'Pembuatan ERD (Entity Relationship Diagram)', completed: false },
        { id: 'db-t2', task: 'Definisi tipe data tabel & relasi', completed: false }
      ]},
      { id: 'api_design', name: 'API Design', status: 'Pending', notes: '', checklist: [
        { id: 'api-t1', task: 'Pembuatan spesifikasi API contract (Swagger/YAML)', completed: false }
      ]},
      { id: 'software_architecture', name: 'Software Architecture', status: 'Pending', notes: '', checklist: [
        { id: 'arch-t1', task: 'Pemilihan arsitektur (Monolith / Microservices)', completed: false },
        { id: 'arch-t2', task: 'Desain infrastruktur server & security', completed: false }
      ]},
      { id: 'development_sprint', name: 'Development Sprint', status: 'Pending', notes: '', checklist: [
        { id: 'dev-t1', task: 'Setup environment lokal & boilerplate project', completed: false },
        { id: 'dev-t2', task: 'Sprint 1 (Pembuatan kerangka layout & routes)', completed: false }
      ]},
      { id: 'testing', name: 'Testing', status: 'Pending', notes: '', checklist: [
        { id: 'test-t1', task: 'Menjalankan unit testing backend/frontend', completed: false },
        { id: 'test-t2', task: 'Uji coba manual user flow utama (UAT)', completed: false }
      ]},
      { id: 'deployment', name: 'Deployment', status: 'Pending', notes: '', checklist: [
        { id: 'dep-t1', task: 'Deployment rilis staging/production', completed: false }
      ]},
      { id: 'monitoring', name: 'Monitoring', status: 'Pending', notes: '', checklist: [
        { id: 'mon-t1', task: 'Setup analytics & log tracking error', completed: false }
      ]},
      { id: 'maintenance', name: 'Maintenance', status: 'Pending', notes: '', checklist: [
        { id: 'maint-t1', task: 'Perbaikan bug & update package dependency berkala', completed: false }
      ]}
    ];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      owner,
      deadline,
      priority,
      status: 'Pending',
      lastUpdate: new Date().toISOString(),
      documents: [],
      stages: defaultStagesTemplate,
    };

    const nextProjects = [...projects, newProject];
    setProjects(nextProjects);
    setActiveProjectId(newProject.id);
    saveProjectsState(nextProjects, newProject.id, 'insert', newProject);
  };

  const handleToggleItem = (stageId: string, itemId: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const nextStages = p.stages.map((stage) => {
          if (stage.id === stageId) {
            const nextChecklist = stage.checklist.map((item) => {
              if (item.id === itemId) {
                return { ...item, completed: !item.completed };
              }
              return item;
            });
            return { ...stage, checklist: nextChecklist };
          }
          return stage;
        });

        return updateProjectStatuses({
          ...p,
          stages: nextStages,
        });
      }
      return p;
    });

    setProjects(updated);
    saveProjectsState(updated, activeProjectId, 'update');
  };

  const handleAddItem = (stageId: string, taskText: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const nextStages = p.stages.map((stage) => {
          if (stage.id === stageId) {
            const newItem: ChecklistItem = {
              id: `item-${Date.now()}`,
              task: taskText,
              completed: false,
            };
            return {
              ...stage,
              checklist: [...stage.checklist, newItem],
            };
          }
          return stage;
        });

        return updateProjectStatuses({
          ...p,
          stages: nextStages,
        });
      }
      return p;
    });

    setProjects(updated);
    saveProjectsState(updated, activeProjectId, 'update');
  };

  const handleDeleteItem = (stageId: string, itemId: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const nextStages = p.stages.map((stage) => {
          if (stage.id === stageId) {
            return {
              ...stage,
              checklist: stage.checklist.filter((item) => item.id !== itemId),
            };
          }
          return stage;
        });

        return updateProjectStatuses({
          ...p,
          stages: nextStages,
        });
      }
      return p;
    });

    setProjects(updated);
    saveProjectsState(updated, activeProjectId, 'update');
  };

  const handleSaveNotes = (stageId: string, notesText: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const nextStages = p.stages.map((stage) => {
          if (stage.id === stageId) {
            return {
              ...stage,
              notes: notesText,
            };
          }
          return stage;
        });

        return {
          ...p,
          stages: nextStages,
          lastUpdate: new Date().toISOString(),
        };
      }
      return p;
    });

    setProjects(updated);
    saveProjectsState(updated, activeProjectId, 'update');
  };

  const handleAddDocument = (fileName: string, type: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        const newDoc = { name: fileName, type };
        return {
          ...p,
          documents: [...p.documents, newDoc],
          lastUpdate: new Date().toISOString(),
        };
      }
      return p;
    });

    setProjects(updated);
    saveProjectsState(updated, activeProjectId, 'update');
  };

  const handleDeleteDocument = (fileName: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          documents: p.documents.filter((doc) => doc.name !== fileName),
          lastUpdate: new Date().toISOString(),
        };
      }
      return p;
    });

    setProjects(updated);
    saveProjectsState(updated, activeProjectId, 'update');
  };

  const handleUpdateProjectInfo = (
    projectId: string,
    updatedFields: Partial<Omit<Project, 'id' | 'stages' | 'documents'>>
  ) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          ...updatedFields,
          lastUpdate: new Date().toISOString(),
        };
      }
      return p;
    });

    setProjects(updated);
    saveProjectsState(updated, projectId, 'update');
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      alert("Tidak dapat menghapus satu-satunya project yang tersisa.");
      return;
    }
    const targetProject = projects.find((p) => p.id === projectId);
    const targetName = targetProject ? targetProject.name : "project";
    if (confirm(`Apakah Anda yakin ingin menghapus project "${targetName}" beserta seluruh progress dan dokumen di dalamnya?`)) {
      const nextProjects = projects.filter((p) => p.id !== projectId);
      setProjects(nextProjects);
      setActiveProjectId(nextProjects[0].id);
      if (nextProjects[0].stages.length > 0) {
        setActiveStageId(nextProjects[0].stages[0].id);
      }
      saveProjectsState(nextProjects, projectId, 'delete');
    }
  };

  // Wait until local storage initialization finishes
  if (!activeProject) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center space-x-2 text-muted-foreground animate-pulse">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span>Memuat Aplikasi DevFlow...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      
      {/* Visual glowing layout gradients for premium design */}
      <div className="glow-spot top-[-100px] left-[10%] opacity-70" />
      <div className="glow-spot bottom-[-50px] right-[5%] opacity-50" />

      {/* Header */}
      <Navbar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Workspace Layout */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Navigation Sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Core Panel Content */}
          <main className="flex-1 min-w-0 space-y-6">
            
            {/* Overview / General Project Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <DashboardCard project={activeProject} progressPercent={stats.progressPercent} />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Statistik Perkembangan
                  </h3>
                  <ProgressCard
                    totalStages={stats.totalStages}
                    completedStages={stats.completedStages}
                    inProgressStages={stats.inProgressStages}
                    pendingStages={stats.pendingStages}
                    progressPercent={stats.progressPercent}
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-base font-bold text-foreground mb-4">
                    Lintasan Tahapan Terkini
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {activeProject.stages.map((stage, idx) => (
                      <button
                        key={stage.id}
                        onClick={() => {
                          setActiveStageId(stage.id);
                          setActiveTab('timeline');
                        }}
                        className="flex items-center space-x-2 rounded-xl border border-border/60 bg-muted/10 p-3 text-left transition-all hover:bg-muted/30 hover:scale-[1.01]"
                      >
                        <div className="shrink-0">
                          {stage.status === 'Completed' ? (
                            <span className="text-emerald-500">🟢</span>
                          ) : stage.status === 'In Progress' ? (
                            <span className="text-amber-500 animate-pulse">🟡</span>
                          ) : (
                            <span className="text-muted-foreground/30">⚪</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {stage.name}
                          </p>
                          <p className="text-3xs text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
                            Tahap {idx + 1}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline SDLC Detail Tab */}
            {activeTab === 'timeline' && activeStage && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
                
                {/* Left Side: Interactive Timeline List */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center space-x-2 mb-2 px-1">
                    <Milestone className="h-4.5 w-4.5 text-muted-foreground" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Proses SDLC
                    </h3>
                  </div>
                  <Timeline
                    stages={activeProject.stages}
                    activeStageId={activeStageId}
                    onSelectStage={setActiveStageId}
                  />
                </div>

                {/* Right Side: Details checklist & notes */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Checklist Section */}
                  <div className="flex items-center space-x-2 mb-1 px-1">
                    <ClipboardList className="h-4.5 w-4.5 text-muted-foreground" />
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Pekerjaan Tahapan
                    </span>
                  </div>
                  <Checklist
                    stage={activeStage}
                    onToggleItem={handleToggleItem}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                  />

                  {/* Notes Section */}
                  <div className="flex items-center space-x-2 mb-1 px-1">
                    <PenTool className="h-4.5 w-4.5 text-muted-foreground" />
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Dokumentasi & Catatan
                    </span>
                  </div>
                  <Notes stage={activeStage} onSaveNotes={handleSaveNotes} />

                </div>
              </div>
            )}

            {/* Project Info Tab */}
            {activeTab === 'info' && (
              <div className="animate-in fade-in duration-300">
                <ProjectInfo
                  project={activeProject}
                  progressPercent={stats.progressPercent}
                  onUpdateProjectInfo={handleUpdateProjectInfo}
                  onDeleteProject={handleDeleteProject}
                />
              </div>
            )}

            {/* Documents List Tab */}
            {activeTab === 'documents' && (
              <div className="animate-in fade-in duration-300">
                <Documents
                  project={activeProject}
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                />
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
