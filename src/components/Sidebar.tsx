import React from 'react';
import { LayoutDashboard, Milestone, Info, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems: MenuItem[] = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'timeline', name: 'SDLC Timeline', icon: Milestone },
    { id: 'info', name: 'Project Info', icon: Info },
    { id: 'documents', name: 'Documents', icon: FileText },
  ];

  return (
    <aside className="w-full shrink-0 border-b border-border bg-card/30 md:w-64 md:border-b-0 md:border-r md:bg-card/20 min-h-[auto] md:min-h-[calc(100vh-4rem)]">
      <div className="flex flex-row md:flex-col p-2 md:p-4 space-x-1 md:space-x-0 md:space-y-1.5 overflow-x-auto md:overflow-visible">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all shrink-0 md:shrink-none ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
