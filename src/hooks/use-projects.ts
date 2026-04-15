'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/types';
import { projectsData } from '@/lib/data';
import { supabase } from '@/lib/supabase/client';

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ''),
    category: (row.category as Project['category']) ?? 'Cinematic Edits',
    type: (row.type as Project['type']) ?? 'image',
    thumbnail: String(row.thumbnail ?? ''),
    src: String(row.src ?? row.thumbnail ?? ''),
    views: Number(row.views ?? 0),
    likes: Number(row.likes ?? 0),
    liked: false,
    comments: [],
    liveLink: row.live_link ? String(row.live_link) : undefined,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const staticProjects = projectsData.map(p => ({
      ...p,
      views: p.views || 0,
      likes: p.likes || 0,
    }));

    const fetchAll = async () => {
      if (!supabase) {
        setProjects(staticProjects);
        setLoading(false);
        return;
      }

      let dbProjects: Record<string, unknown>[] | null = null;
      let stats: { project_id: string; views: number; likes: number }[] | null = null;

      try {
        const [proj, stat] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('project_stats').select('project_id, views, likes'),
        ]);
        if (proj.error) console.error('Supabase projects error:', proj.error);
        else dbProjects = proj.data as Record<string, unknown>[];
        if (stat.error) console.error('Supabase stats error:', stat.error);
        else stats = stat.data as { project_id: string; views: number; likes: number }[];
      } catch (err) {
        console.error('Failed to fetch projects from Supabase:', err);
      }

      const statsMap = new Map(
        (stats ?? []).map(row => [row.project_id, { views: row.views, likes: row.likes }])
      );

      const applyStats = (p: Project): Project => {
        const s = statsMap.get(p.id);
        return s ? { ...p, views: s.views ?? p.views, likes: s.likes ?? p.likes } : p;
      };

      const supabaseProjects = (dbProjects ?? []).map(row => applyStats(rowToProject(row)));
      const supabaseIds = new Set(supabaseProjects.map(p => p.id));
      const merged = [
        ...supabaseProjects,
        ...staticProjects.filter(p => !supabaseIds.has(p.id)).map(applyStats),
      ];

      setProjects(merged);
      setLoading(false);
    };

    fetchAll();

    if (!supabase) return;

    // Realtime: new/updated projects
    const projectsChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, (payload) => {
        const newProject = rowToProject(payload.new as Record<string, unknown>);
        setProjects(prev => [newProject, ...prev.filter(p => p.id !== newProject.id)]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
        const updated = rowToProject(payload.new as Record<string, unknown>);
        setProjects(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'projects' }, (payload) => {
        const deleted = payload.old as { id: string };
        setProjects(prev => prev.filter(p => p.id !== String(deleted.id)));
      })
      .subscribe();

    // Realtime: stats updates (views, likes)
    const statsChannel = supabase
      .channel('project_stats_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_stats' }, (payload) => {
        const updated = payload.new as { project_id: string; views: number; likes: number };
        if (!updated?.project_id) return;
        setProjects(prev => prev.map(p =>
          p.id === updated.project_id
            ? { ...p, views: updated.views ?? p.views, likes: updated.likes ?? p.likes }
            : p
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(statsChannel);
    };
  }, []);

  return { projects, loading, error, setProjects };
}
