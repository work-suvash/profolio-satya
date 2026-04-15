'use client';

import { useState, useEffect, useRef } from 'react';
import { getServices, upsertService, deleteService, uploadFile, type Service } from '@/lib/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import {
  Plus, Pencil, Trash2, Loader2, X, Save, Upload, Layers,
  Code, Palette, Smartphone, Globe, Database, Server, Layout, Cpu,
  Zap, Monitor, Shield, Camera, Video, FileText, ShoppingCart,
  Users, BarChart, Mail, Wifi, type LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Palette, Smartphone, Globe, Database, Server, Layout, Layers, Cpu,
  Zap, Monitor, Shield, Camera, Video, FileText, ShoppingCart, Users, BarChart, Mail, Wifi,
};
const AVAILABLE_ICONS = Object.keys(ICON_MAP);

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Code;
  return <Icon className={className} />;
}

const EMPTY: Partial<Service> = { icon_name: 'Video', title: '', description: '', thumbnail: '', link: '', sort_order: 0 };

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { loadServices(); }, []);

  async function loadServices() {
    setLoading(true);
    setServices(await getServices());
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const { error } = await upsertService(editing) as { error: unknown };
    if (!error) {
      toast({ title: editing.id ? 'Skill updated!' : 'Skill added!' });
      setEditing(null);
      loadServices();
    } else {
      toast({ title: 'Failed to save skill', variant: 'destructive' });
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await deleteService(id) as { error: unknown };
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Skill deleted' });
    } else {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
    setDeleting(null);
  }

  async function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile('portfolio', `services/thumb-${Date.now()}.${file.name.split('.').pop()}`, file);
    if (url) setEditing(prev => prev ? { ...prev, thumbnail: url } : prev);
    setUploading(false);
  }

  function set(key: keyof Service, value: string | number) {
    setEditing(prev => prev ? { ...prev, [key]: value } : prev);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skills</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage editing skills shown on your portfolio</p>
        </div>
        <button onClick={() => setEditing(EMPTY)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => (
            <div key={service.id} className="bg-card border border-border/40 rounded-xl p-5 hover:border-border/80 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <ServiceIcon name={service.icon_name} className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{service.title}</h3>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(service)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(service.id)} disabled={deleting === service.id}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                    {deleting === service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{service.description}</p>
              {service.link && (
                <a href={service.link} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-2 block truncate">{service.link}</a>
              )}
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground bg-card rounded-2xl border border-border/30">
              <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No skills yet</p>
              <p className="text-sm mt-1 opacity-70">Click "Add Skill" to create one</p>
            </div>
          )}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">{editing.id ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
                <div className="grid grid-cols-5 gap-1.5 bg-background rounded-lg p-2 border border-border/50 max-h-32 overflow-y-auto">
                  {AVAILABLE_ICONS.map(icon => (
                    <button key={icon} onClick={() => set('icon_name', icon)} title={icon}
                      className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                        editing.icon_name === icon
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      }`}>
                      <ServiceIcon name={icon} className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                <input type="text" value={editing.title ?? ''} onChange={e => set('title', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Skill title" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <textarea value={editing.description ?? ''} onChange={e => set('description', e.target.value)}
                  rows={3} className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  placeholder="What this editing skill includes..." />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Thumbnail Image</label>
                <div className="flex gap-2 mb-1.5">
                  <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbUpload} className="hidden" />
                  <button onClick={() => thumbRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs hover:bg-secondary/70 transition-colors disabled:opacity-50">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload Image
                  </button>
                </div>
                <input type="url" value={editing.thumbnail ?? ''} onChange={e => set('thumbnail', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Or paste image URL..." />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Link (optional)</label>
                <input type="url" value={editing.link ?? ''} onChange={e => set('link', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Sort Order</label>
                <input type="number" value={editing.sort_order ?? 0} onChange={e => set('sort_order', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Skill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
