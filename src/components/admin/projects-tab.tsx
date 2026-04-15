'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getAdminProjects, upsertProject, deleteProject,
  getProjectComments, deleteComment, uploadFile,
  type AdminProject, type ProjectComment
} from '@/lib/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import {
  Plus, Pencil, Trash2, Loader2, X, Save, Upload,
  FolderOpen, Eye, ThumbsUp, MessageSquare, ExternalLink
} from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = ['Cinematic Edits', 'Reels & Shorts', 'Gaming Montages', 'Before / After', 'Thumbnails'];
const EMPTY: Partial<AdminProject> = { title: '', description: '', category: 'Cinematic Edits', type: 'video', thumbnail: '', src: '', live_link: '', views: 0, likes: 0 };

export default function ProjectsTab() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminProject> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingSrc, setUploadingSrc] = useState(false);
  const [comments, setComments] = useState<{ project: AdminProject; list: ProjectComment[] } | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const thumbRef = useRef<HTMLInputElement>(null);
  const srcRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    setLoading(true);
    setProjects(await getAdminProjects());
    setLoading(false);
  }

  function set<K extends keyof AdminProject>(key: K, value: AdminProject[K]) {
    setEditing(prev => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const { error } = await upsertProject(editing) as { error: unknown };
    if (!error) {
      toast({ title: editing.id ? 'Visual project updated!' : 'Visual project added!' });
      setEditing(null);
      loadProjects();
    } else {
      toast({ title: 'Failed to save visual project', variant: 'destructive' });
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await deleteProject(id) as { error: unknown };
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Visual project deleted' });
    } else {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
    setDeleting(null);
  }

  async function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    const url = await uploadFile('portfolio', `projects/thumb-${Date.now()}.${file.name.split('.').pop()}`, file);
    if (url) set('thumbnail', url);
    setUploadingThumb(false);
  }

  async function handleSrcUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSrc(true);
    const url = await uploadFile('portfolio', `projects/media-${Date.now()}.${file.name.split('.').pop()}`, file);
    if (url) set('src', url);
    setUploadingSrc(false);
  }

  async function loadComments(project: AdminProject) {
    setLoadingComments(true);
    setComments({ project, list: [] });
    const list = await getProjectComments(project.id);
    setComments({ project, list });
    setLoadingComments(false);
  }

  async function handleDeleteComment(id: string) {
    const { error } = await deleteComment(id) as { error: unknown };
    if (!error) {
      setComments(prev => prev ? { ...prev, list: prev.list.filter(c => c.id !== id) } : prev);
      toast({ title: 'Comment deleted' });
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visual Projects</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Add, edit and manage editing portfolio work</p>
        </div>
        <button onClick={() => setEditing(EMPTY)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" /> Add Edit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card rounded-2xl border border-border/30">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No visual projects yet</p>
          <p className="text-sm mt-1 opacity-70">Click "Add Edit" to create your first one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="bg-card border border-border/40 rounded-xl p-4 hover:border-border/80 transition-colors flex items-center gap-4">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                {p.thumbnail && <Image src={p.thumbnail} alt={p.title} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full shrink-0">{p.category}</span>
                  <span className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded-full shrink-0">{p.type}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{p.likes}</span>
                  {p.live_link && <a href={p.live_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline"><ExternalLink className="h-3 w-3" />Preview</a>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => loadComments(p)} title="View comments"
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button onClick={() => setEditing(p)}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  {deleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">{editing.id ? 'Edit Visual Project' : 'Add Visual Project'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                <input type="text" value={editing.title ?? ''} onChange={e => set('title', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Edit title" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <textarea value={editing.description ?? ''} onChange={e => set('description', e.target.value)}
                  rows={3} className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                  <select value={editing.category ?? 'Cinematic Edits'} onChange={e => set('category', e.target.value as AdminProject['category'])}
                    className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
                  <select value={editing.type ?? 'image'} onChange={e => set('type', e.target.value as 'image' | 'video')}
                    className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Thumbnail</label>
                <div className="flex gap-2 mb-1.5">
                  <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbUpload} className="hidden" />
                  <button onClick={() => thumbRef.current?.click()} disabled={uploadingThumb}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs hover:bg-secondary/70 transition-colors disabled:opacity-50">
                    {uploadingThumb ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload Thumbnail
                  </button>
                </div>
                <input type="url" value={editing.thumbnail ?? ''} onChange={e => set('thumbnail', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Thumbnail image URL" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {editing.type === 'video' ? 'Video File' : 'Full Image'}
                </label>
                <div className="flex gap-2 mb-1.5">
                  <input ref={srcRef} type="file" accept={editing.type === 'video' ? 'video/*' : 'image/*'} onChange={handleSrcUpload} className="hidden" />
                  <button onClick={() => srcRef.current?.click()} disabled={uploadingSrc}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs hover:bg-secondary/70 transition-colors disabled:opacity-50">
                    {uploadingSrc ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload {editing.type === 'video' ? 'Video' : 'Image'}
                  </button>
                </div>
                <input type="url" value={editing.src ?? ''} onChange={e => set('src', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Or paste direct URL..." />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Video / Drive / YouTube Link (optional)</label>
                <input type="url" value={editing.live_link ?? ''} onChange={e => set('live_link', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="https://youtube.com/..." />
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Visual Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {comments && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setComments(null)}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">Comments</h2>
                <p className="text-xs text-muted-foreground">{comments.project.title}</p>
              </div>
              <button onClick={() => setComments(null)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {loadingComments ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : comments.list.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No comments on this project</p>
                </div>
              ) : comments.list.map(c => (
                <div key={c.id} className="flex items-start gap-3 bg-background rounded-xl p-3 border border-border/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{c.author}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mt-0.5">{c.text}</p>
                  </div>
                  <button onClick={() => handleDeleteComment(c.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
