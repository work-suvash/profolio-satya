'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/use-projects';
import type { Project } from '@/types';
import { Eye, ThumbsUp, Heart, PlayCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { ProjectOverlay } from '@/components/project-overlay';

const formatViews = (views: number) => {
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
};

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const filterType = searchParams.get('type') || 'all';
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filterType === 'video') return p.type === 'video';
    if (filterType === 'photo') return p.type === 'image';
    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'trending') return b.views - a.views;
    return 0;
  });

  const getPageTitle = () => {
    if (filterType === 'video') return 'Video Edits';
    if (filterType === 'photo') return 'Thumbnail & Before / After Work';
    return 'Visual Projects';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className={`container mx-auto px-4 md:px-6 py-12 transition-all duration-500 ${isLoading ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}>
          {/* Header Section */}
          <div className="mb-8">
            <Link 
              href="/#projects"
              scroll={false}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 group text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Creative Edits</span>
            </Link>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-primary">{getPageTitle()}</h1>
              <p className="text-foreground/70 max-w-2xl text-[10px] md:text-xs">
                {filteredProjects.length} visual project{filteredProjects.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all duration-300 ${
                  sortBy === 'newest'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all duration-300 ${
                  sortBy === 'popular'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                }`}
              >
                Most Liked
              </button>
              <button
                onClick={() => setSortBy('trending')}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all duration-300 ${
                  sortBy === 'trending'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                }`}
              >
                Trending
              </button>
            </div>

            <div className="flex gap-2">
              <Link href="/projects?type=all">
                <Button variant={filterType === 'all' ? 'default' : 'outline'} size="sm" className="h-7 text-[10px] px-3">
                  All
                </Button>
              </Link>
              <Link href="/projects?type=video">
                <Button variant={filterType === 'video' ? 'default' : 'outline'} size="sm" className="h-7 text-[10px] px-3">
                  Videos
                </Button>
              </Link>
              <Link href="/projects?type=photo">
                <Button variant={filterType === 'photo' ? 'default' : 'outline'} size="sm" className="h-7 text-[10px] px-3">
                  Photos
                </Button>
              </Link>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group relative overflow-hidden rounded-xl bg-background border-border/50 flex flex-col cursor-pointer transform-gpu transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    
                    {/* Static Bottom Info */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white z-10">
                       <h3 className="font-semibold text-[10px] truncate">{project.title}</h3>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-2">
                       {project.type === 'video' && 
                          <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle className="w-8 h-8 text-white/80" />
                          </div>
                       }
                      <div className="transform-gpu translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-bold text-[10px] mb-1 line-clamp-1">{project.title}</h3>
                          <div className="flex justify-between items-center text-[8px] md:text-[9px]">
                              <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                      <Eye className="w-2.5 h-2.5"/>
                                      <span>{formatViews(project.views)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                      <ThumbsUp className="w-2.5 h-2.5" />
                                      <span>{formatViews(project.likes)}</span>
                                  </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 {project.liveLink && (
                                   <a 
                                     href={project.liveLink}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="p-1 rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <ExternalLink className="w-2.5 h-2.5" />
                                   </a>
                                 )}
                                 <div className="flex items-center gap-1">
                                    <Heart className="w-2.5 h-2.5" />
                                    <span>{project.comments.length}</span>
                                 </div>
                              </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No visual projects found</p>
            </div>
          )}
        </div>
      </main>
      {selectedProject && <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  );
}
