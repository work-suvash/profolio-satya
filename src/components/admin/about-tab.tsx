'use client';

import { useState, useEffect, useRef } from 'react';
import { getSetting, setSetting, uploadFile, type AboutSettings, defaultAbout } from '@/lib/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';

type ExtendedAbout = AboutSettings & { photo_position: string; photo_scale: number };

export default function AboutTab() {
  const [settings, setSettings] = useState<ExtendedAbout>({ ...defaultAbout, photo_position: 'center', photo_scale: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    setLoading(true);
    const data = await getSetting<ExtendedAbout>('about', { ...defaultAbout, photo_position: 'center', photo_scale: 1 });
    setSettings(data);
    setLoading(false);
  }

  function update<K extends keyof ExtendedAbout>(key: K, value: ExtendedAbout[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile('portfolio', `about/photo-${Date.now()}.${file.name.split('.').pop()}`, file);
    if (url) { update('photo', url); toast({ title: 'Photo uploaded!' }); }
    else toast({ title: 'Upload failed', variant: 'destructive' });
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const ok = await setSetting('about', settings);
    toast(ok ? { title: 'About settings saved!' } : { title: 'Failed to save', variant: 'destructive' });
    setSaving(false);
  }

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const scale = settings.photo_scale ?? 1;

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">About Section</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your about section photo and content</p>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">About Photo</h3>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative w-36 h-48 rounded-xl overflow-hidden border-2 border-primary/30 shrink-0 bg-secondary/50">
            {settings.photo && (
              <Image
                src={settings.photo} alt="About photo" fill
                className="object-cover transition-transform"
                style={{
                  objectPosition: settings.photo_position ?? 'center',
                  transform: `scale(${scale})`,
                  transformOrigin: settings.photo_position ?? 'center',
                }}
              />
            )}
          </div>
          <div className="flex-1 w-full space-y-3">
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button onClick={() => photoRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/70 text-sm transition-colors disabled:opacity-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <input type="url" value={settings.photo} onChange={e => update('photo', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Or paste image URL..." />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Image Position</label>
                <select value={settings.photo_position ?? 'center'} onChange={e => update('photo_position', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                  {['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'].map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Zoom: {scale.toFixed(2)}x
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={() => update('photo_scale', Math.max(1, scale - 0.1))}
                    className="p-1.5 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors">
                    <ZoomOut className="h-3.5 w-3.5 text-foreground" />
                  </button>
                  <input type="range" min="1" max="2.5" step="0.05" value={scale}
                    onChange={e => update('photo_scale', Number(e.target.value))}
                    className="flex-1 h-1.5 accent-primary" />
                  <button onClick={() => update('photo_scale', Math.min(2.5, scale + 0.1))}
                    className="p-1.5 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors">
                    <ZoomIn className="h-3.5 w-3.5 text-foreground" />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => { update('photo', ''); update('photo_scale', 1); update('photo_position', 'center'); }}
              className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors border border-destructive/20">
              Remove photo
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Section Content</h3>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Section Subtitle</label>
          <input type="text" value={settings.subtitle} onChange={e => update('subtitle', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="My journey in the world of code and design." />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Main Heading</label>
          <input type="text" value={settings.title} onChange={e => update('title', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="Crafting Digital Experiences" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Bio / Description</label>
          <textarea value={settings.bio} onChange={e => update('bio', e.target.value)}
            rows={6} className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            placeholder="Write about yourself, your experience, and what you do..." />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
