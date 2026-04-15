'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { useProjects } from '@/hooks/use-projects';
import type { Project } from '@/types';
import { Heart, Eye, ThumbsUp, PlayCircle } from 'lucide-react';
import { ProjectOverlay } from '../project-overlay';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { toggleLike } from '@/lib/likes';
import { trackProjectView, toggleProjectLike } from '@/lib/supabase/stats';

const filters = ['All', 'Cinematic Edits', 'Reels & Shorts', 'Gaming Montages', 'Before / After', 'Thumbnails'];

const formatViews = (views: number) => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views;
};

// Extracted and memoized ProjectCard for better performance
const ProjectCard = memo(({ 
  project, 
  liked, 
  onClick, 
  onLike 
}: { 
  project: Project; 
  liked: boolean; 
  onClick: (p: Project) => void;
  onLike: (e: React.MouseEvent, id: string) => void;
}) => {
  return (
    <Card
      className="group relative overflow-hidden rounded-lg bg-background border-border/50 flex flex-col cursor-pointer transform-gpu transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 will-change-transform"
      onClick={() => onClick(project)}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8AKpT8S9mgAAAABJRU5ErkJggg=="
        />
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white z-10 transition-opacity duration-300 group-hover:opacity-0">
           <h3 className="font-semibold text-sm truncate whitespace-nowrap">{project.title}</h3>
        </div>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col justify-end p-4">
           {project.type === 'video' && 
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayCircle className="w-12 h-12 text-white/80 transform-gpu transition-transform group-hover:scale-110" />
              </div>
           }
          <div className="transform-gpu translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-bold text-base mb-2 line-clamp-1">{project.title}</h3>
              <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5"/>
                          <span>{formatViews(project.views)}</span>
                      </div>
                      <button 
                        onClick={(e) => onLike(e, project.id)} 
                        className={cn("flex items-center gap-1 transition-colors hover:text-primary", liked ? 'text-primary' : 'text-white')}
                      >
                          <ThumbsUp className={cn("w-3.5 h-3.5", liked && "fill-current")} />
                          <span>{formatViews(project.likes)}</span>
                      </button>
                  </div>
                  <div className="flex items-center gap-1">
                     <Heart className="w-3.5 h-3.5" />
                     <span>{project.comments?.length || 0}</span>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects, loading, error, setProjects: setLocalProjects } = useProjects();
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedProjects');
    if (storedLikes) {
      try {
        setLikedProjects(new Set(JSON.parse(storedLikes)));
      } catch (e) {
        console.error("Error parsing likes:", e);
      }
    }
  }, []);

  const handleLike = React.useCallback(async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    const isLiked = likedProjects.has(projectId);
    
    setLocalProjects(prev => prev.map(p => {
        if (p.id === projectId) {
            return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
    }));
    
    toggleLike(projectId, likedProjects, setLikedProjects);
    await toggleProjectLike(projectId, !isLiked);
  }, [likedProjects, setLocalProjects]);

  const handleProjectClick = React.useCallback((project: Project) => {
    setSelectedProject(project);
    trackProjectView(project.id);
  }, []);

  const filteredProjects = useMemo(() => 
    activeFilter === 'All'
      ? projects
      : projects.filter(p => p.category === activeFilter),
    [projects, activeFilter]
  );
    
  if (loading) {
      return (
        <section id="projects" className="py-12 bg-card">
          <div className="container mx-auto px-4 md:px-6">
              <div className="text-center space-y-4 mb-8">
                  <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Creative Edits</h2>
              </div>
              <div className="flex justify-center flex-wrap gap-2 mb-8">
                  {filters.map(filter => (
                      <Skeleton key={filter} className="h-10 w-24 rounded-full" />
                  ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                      <Card key={i} className="flex flex-col bg-background border-border/50">
                          <Skeleton className="aspect-[4/3] w-full" />
                          <div className="p-4 flex-grow">
                              <Skeleton className="h-4 w-3/4 mb-2" />
                              <Skeleton className="h-3 w-1/2" />
                          </div>
                      </Card>
                  ))}
              </div>
          </div>
        </section>
      );
  }

  if (error) {
      return <div className="text-red-500 text-center py-20 font-medium">Error loading projects: {error.message}</div>
  }

  return (
    <>
      <section id="projects" className="py-12 bg-card overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Creative Edits</h2>
          </div>

          <nav className="flex justify-center flex-wrap gap-3 mb-8" aria-label="Editing portfolio filters">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "filter-btn",
                  activeFilter === filter ? 'filter-btn-active' : 'filter-btn-inactive'
                )}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </nav>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                liked={likedProjects.has(project.id)}
                onClick={handleProjectClick}
                onLike={handleLike}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-border/30 gap-6">
              <div className="flex gap-4">
                  <Link href="/projects?type=video" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 group">
                    Video edits <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                  <Link href="/projects?type=photo" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 group">
                    Thumbnails <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
              </div>
              <Link href="/projects?type=all" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 group">
                See all visual projects <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
          </div>
        </div>
      </section>
      {selectedProject && <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  );
}
