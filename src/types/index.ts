export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export type StageStatus = 'Completed' | 'In Progress' | 'Pending';

export interface SDLCStage {
  id: string;
  name: string;
  status: StageStatus;
  notes: string;
  checklist: ChecklistItem[];
}

export interface DocumentItem {
  name: string;
  type: string;
}

export type ProjectPriority = 'High' | 'Medium' | 'Low';
export type ProjectStatus = 'Completed' | 'In Progress' | 'Pending';

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  deadline: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  lastUpdate: string;
  documents: DocumentItem[];
  stages: SDLCStage[];
}
