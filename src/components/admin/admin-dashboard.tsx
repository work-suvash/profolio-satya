'use client';

import { useState } from 'react';
import { MessageSquare, User, Layers, Info, FolderOpen, LogOut, LayoutDashboard } from 'lucide-react';
import MessagesTab from './messages-tab';
import HeroTab from './hero-tab';
import ServicesTab from './services-tab';
import AboutTab from './about-tab';
import ProjectsTab from './projects-tab';
import DashboardTab from './dashboard-tab';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'hero', label: 'Hero & Profile', icon: User },
  { id: 'services', label: 'Skills', icon: Layers },
  { id: 'about', label: 'About', icon: Info },
  { id: 'projects', label: 'Visual Projects', icon: FolderOpen },
];

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label ?? '';

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">

      {/* Sidebar — fixed height, never scrolls */}
      <aside className="w-16 md:w-60 bg-card border-r border-border/40 flex flex-col shrink-0 h-full">

        {/* Logo */}
        <div className="px-4 py-5 border-b border-border/40 flex items-center gap-3 shrink-0">
          <span style={{ fontFamily: 'var(--font-script)', fontSize: '1.8rem', color: '#ffffff', lineHeight: 1 }} className="shrink-0">Satya</span>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-foreground leading-tight">Admin Panel</span>
            <span className="text-[11px] text-muted-foreground">Portfolio Manager</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="hidden md:block flex-1 text-left truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border/40 shrink-0">
          <button
            onClick={onLogout}
            title="Logout"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content — scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top bar */}
        <header className="h-14 border-b border-border/40 bg-card/60 backdrop-blur-sm flex items-center px-6 shrink-0">
          <h1 className="text-base font-semibold text-foreground">{activeTabLabel}</h1>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'hero' && <HeroTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'about' && <AboutTab />}
          {activeTab === 'projects' && <ProjectsTab />}
        </main>
      </div>
    </div>
  );
}
