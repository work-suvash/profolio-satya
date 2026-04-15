'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Project, ProjectComment } from '@/types';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThumbsUp, Eye, Send, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProjectOverlayProps {
  project: Project | null;
  onClose: () => void;
}

const formatViews = (views: number) => {
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
};

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ProjectComment[]>(project?.comments || []);
  const [likes, setLikes] = useState(project?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setComments(project?.comments || []);
    setLikes(project?.likes || 0);
    setIsLiked(false);
  }, [project]);

  useEffect(() => {
    if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [comments]);


  if (!project) return null;

  const handleAddComment = () => {
    if (commentText.trim() === '') {
        toast({ title: "Comment can't be empty", variant: 'destructive'});
        return;
    }

    const newComment: ProjectComment = {
        id: `c${Date.now()}`,
        author: 'Guest User',
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
        avatar: `https://picsum.photos/seed/${commentText.charCodeAt(0)}/32/32`
    };

    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
      toast({ title: 'Like removed', variant: 'default' });
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      toast({ title: 'Liked!', variant: 'default' });
    }
  };

  const handlePreview = () => {
    if (project?.liveLink) {
      window.open(project.liveLink, '_blank');
      toast({ title: 'Opening video preview...', variant: 'default' });
    }
  };


  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-background/95 backdrop-blur-xl text-foreground p-0 w-[95vw] h-[95vh] max-w-6xl flex flex-col md:flex-row data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 rounded-[25px] overflow-hidden shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </VisuallyHidden>
        {/* Media Section */}
        <div className="w-full md:w-2/5 h-3/4 md:h-full bg-black flex items-center justify-center relative md:rounded-l-3xl overflow-hidden group overlay-media">
          {project.type === 'image' ? (
            <Image
              src={project.src}
              alt={project.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <video
              src={project.src}
              controls
              autoPlay
              loop
              muted
              className="w-full h-full object-contain"
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-3/5 h-1/4 md:h-full flex flex-col bg-gradient-to-b from-card/50 to-background/50 md:rounded-r-3xl overlay-sidebar">
          {/* Header */}
          <div className="project-overlay-header overlay-info-item">
            <h2 className="text-3xl font-bold text-primary mb-3">{project.title}</h2>
            <p className="text-foreground/80 text-sm leading-relaxed">{project.description}</p>
            
            {/* Stats and Preview Button */}
            <div className="flex flex-wrap gap-3 mt-5">
              <div className="stat-badge">
                <Eye className="w-4 h-4" />
                <span>{formatViews(project.views)}</span>
              </div>
              <button 
                onClick={handleLike}
                className={`stat-badge cursor-pointer transition-all duration-300 ${
                  isLiked 
                    ? 'bg-primary/30 border-primary/50 text-primary scale-105' 
                    : 'hover:bg-primary/20 hover:border-primary/40'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 transition-transform duration-300 ${isLiked ? 'scale-110 fill-current' : ''}`} />
                <span>{formatViews(likes)}</span>
              </button>
              {project.liveLink && (
                <Button
                  onClick={handlePreview}
                  variant="ghost"
                  size="sm"
                  className="stat-badge cursor-pointer hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 border border-primary/30 bg-primary/10"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Watch</span>
                </Button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div ref={commentsContainerRef} className="project-overlay-content">
            {comments.length > 0 ? (
              <div className="p-6 space-y-4">
                {comments.map((comment, index) => (
                  <div 
                    key={comment.id} 
                    className="overlay-comment flex items-start gap-3"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Avatar className="w-9 h-9 border-2 border-primary/40 flex-shrink-0 ring-1 ring-primary/20">
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                      <AvatarFallback className="bg-primary/20 text-primary">{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary/40 backdrop-blur-sm rounded-2xl p-4 flex-1 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                      <p className="font-semibold text-sm text-foreground">{comment.author}</p>
                      <p className="text-sm text-foreground/70 mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="text-2xl">💬</div>
                </div>
                <p className="font-semibold text-foreground mb-1">No comments yet</p>
                <p className="text-sm text-foreground/60">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="project-overlay-footer">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Add a comment..."
                className="comment-input flex-1"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button 
                type="button" 
                size="icon" 
                className="send-btn-gradient bg-background text-primary flex-shrink-0 transform hover:scale-105"
                onClick={handleAddComment}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
