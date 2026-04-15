'use client';

import { useState, useEffect, useRef } from 'react';
import { getSetting, setSetting, uploadFile, type HeroSettings, defaultHero } from '@/lib/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';

const SOCIAL_FIELDS = [
  { key: 'social_facebook', label: 'Facebook URL' },
  { key: 'social_instagram', label: 'Instagram URL' },
  { key: 'social_whatsapp', label: 'WhatsApp URL (wa.me link)' },
  { key: 'social_linkedin', label: 'LinkedIn URL' },
] as const;

export default function HeroTab() {
  const [settings, setSettings] = useState<HeroSettings>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const profileRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    setLoading(true);
    const data = await getSetting('hero', defaultHero);
    setSettings(data);
    setLoading(false);
  }

  function update(key: keyof HeroSettings, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function handleProfileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    const url = await uploadFile('portfolio', `profile/profile-${Date.now()}.${file.name.split('.').pop()}`, file);
    if (url) { update('profile_pic', url); toast({ title: 'Profile picture uploaded!' }); }
    else toast({ title: 'Upload failed', variant: 'destructive' });
    setUploadingProfile(false);
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    const url = await uploadFile('portfolio', `cv/cv-${Date.now()}.${file.name.split('.').pop()}`, file);
    if (url) { update('cv_link', url); toast({ title: 'CV uploaded!' }); }
    else toast({ title: 'Upload failed', variant: 'destructive' });
    setUploadingCv(false);
  }

  async function handleSave() {
    setSaving(true);
    const ok = await setSetting('hero', settings);
    toast(ok ? { title: 'Hero settings saved!' } : { title: 'Failed to save', variant: 'destructive' });
    setSaving(false);
  }

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hero Section</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your main banner, profile picture and stats</p>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Profile Picture</h3>
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 bg-secondary">
            <Image src={settings.profile_pic || '/profile.png'} alt="Profile" fill className="object-cover" />
          </div>
          <div className="flex-1 space-y-2">
            <input ref={profileRef} type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
            <button onClick={() => profileRef.current?.click()} disabled={uploadingProfile}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/70 text-sm transition-colors disabled:opacity-50">
              {uploadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploadingProfile ? 'Uploading...' : 'Upload Photo'}
            </button>
            <input type="url" value={settings.profile_pic} onChange={e => update('profile_pic', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Or paste image URL..." />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {([['name', 'Your Name'], ['tagline', 'Tagline / Specialty']] as const).map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
              <input type="text" value={settings[key]} onChange={e => update(key, e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          {([['experiences', 'Experiences'], ['projects_done', 'Projects Done'], ['rating', 'Rating by Clients']] as const).map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
              <input type="text" value={settings[key]} onChange={e => update(key, e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="e.g. 1+" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-foreground">CV / Resume</h3>
        <div className="flex gap-2">
          <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" />
          <button onClick={() => cvRef.current?.click()} disabled={uploadingCv}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/70 text-sm transition-colors disabled:opacity-50">
            {uploadingCv ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploadingCv ? 'Uploading...' : 'Upload CV File'}
          </button>
        </div>
        <input type="url" value={settings.cv_link} onChange={e => update('cv_link', e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          placeholder="Or enter direct download link..." />
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-foreground">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SOCIAL_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
              <input type="url" value={settings[key]} onChange={e => update(key, e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="https://..." />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
}
