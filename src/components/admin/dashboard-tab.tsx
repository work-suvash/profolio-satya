'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { MessageSquare, FolderOpen, Layers, Eye, ThumbsUp, Users, Clock, RefreshCw, Loader2 } from 'lucide-react';

interface Stats {
  messages: number;
  projects: number;
  services: number;
  totalViews: number;
  totalLikes: number;
  recentMessages: Array<{ id: string; first_name: string; last_name: string; service: string; created_at: string }>;
  recentProjects: Array<{ id: string; title: string; views: number; likes: number; created_at: string }>;
}

export default function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    setLoading(true);

    if (!supabase) {
      setStats({ messages: 0, projects: 0, services: 0, totalViews: 0, totalLikes: 0, recentMessages: [], recentProjects: [] });
      setLoading(false);
      return;
    }

    const [
      { count: messages },
      { count: projects },
      { count: services },
      { data: projectsData },
      { data: recentMessages },
    ] = await Promise.all([
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('id, title, views, likes, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('contact_messages').select('id, first_name, last_name, service, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    const totalViews = (projectsData ?? []).reduce((sum, p) => sum + (p.views ?? 0), 0);
    const totalLikes = (projectsData ?? []).reduce((sum, p) => sum + (p.likes ?? 0), 0);

    setStats({
      messages: messages ?? 0,
      projects: projects ?? 0,
      services: services ?? 0,
      totalViews,
      totalLikes,
      recentMessages: (recentMessages ?? []) as Stats['recentMessages'],
      recentProjects: (projectsData ?? []) as Stats['recentProjects'],
    });
    setLoading(false);
  }

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Visual Projects', value: stats.projects, icon: FolderOpen, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Skills', value: stats.services, icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Likes', value: stats.totalLikes, icon: ThumbsUp, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Overview of your portfolio performance</p>
        </div>
        <button onClick={loadStats} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card border border-border/40 rounded-xl p-4 space-y-2">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Recent Messages</h3>
          </div>
          {stats.recentMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentMessages.map(msg => (
                <div key={msg.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{msg.first_name} {msg.last_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.service}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/70 shrink-0">
                    <Clock className="h-3 w-3" />
                    {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Top Visual Projects</h3>
          </div>
          {stats.recentProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No visual projects yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentProjects.map(proj => (
                <div key={proj.id} className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground truncate min-w-0">{proj.title}</p>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{proj.views ?? 0}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{proj.likes ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
