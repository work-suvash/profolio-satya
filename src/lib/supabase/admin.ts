import { supabase } from './client';

export interface HeroSettings {
  profile_pic: string;
  name: string;
  tagline: string;
  experiences: string;
  projects_done: string;
  rating: string;
  cv_link: string;
  social_facebook: string;
  social_instagram: string;
  social_whatsapp: string;
  social_linkedin: string;
}

export const defaultHero: HeroSettings = {
  profile_pic: '',
  name: 'Satya Raj',
  tagline: 'Video Editor / Content Editor & I create cinematic edits, reels & visual stories',
  experiences: '1+',
  projects_done: '20+',
  rating: '1+',
  cv_link: '',
  social_facebook: 'https://www.facebook.com/suvash.mukhiya.752',
  social_instagram: 'https://www.instagram.com/aint_suvash',
  social_whatsapp: 'https://wa.me/9779828223787',
  social_linkedin: 'https://www.linkedin.com/in/work-suvash-476673376/',
};

export interface AboutSettings {
  title: string;
  subtitle: string;
  bio: string;
  photo: string;
  photo_position: string;
  photo_scale: number;
}

export const defaultAbout: AboutSettings = {
  title: 'Crafting Cinematic Visual Stories',
  subtitle: 'My journey in video editing and content creation.',
  bio: 'I am a passionate video editor creating engaging and cinematic content for social media, creators, and brands. My work focuses on sharp storytelling, clean pacing, color grading, motion graphics, and edits that keep viewers watching.',
  photo: '/profile.png',
  photo_position: 'center',
  photo_scale: 1,
};

export interface Service {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
  sort_order: number;
}

export interface Message {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
}

export interface AdminProject {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  thumbnail: string;
  src: string;
  live_link: string;
  views: number;
  likes: number;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  author: string;
  text: string;
  created_at: string;
}

export async function getSetting<T>(key: string, defaults: T): Promise<T> {
  if (!supabase) return defaults;
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (!data?.value) return defaults;
  return { ...defaults, ...(data.value as object) };
}

export async function setSetting(key: string, value: object): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

export async function getServices(): Promise<Service[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('services').select('*').order('sort_order');
  return (data ?? []) as Service[];
}

export async function upsertService(service: Partial<Service>): Promise<{ error: unknown }> {
  if (!supabase) return { error: new Error('Supabase client not configured') };
  if (service.id) {
    const { id, ...rest } = service;
    return supabase.from('services').update(rest).eq('id', id);
  }
  return supabase.from('services').insert(service);
}

export async function deleteService(id: string): Promise<{ error: unknown }> {
  if (!supabase) return { error: new Error('Supabase client not configured') };
  return supabase.from('services').delete().eq('id', id);
}

export async function getMessages(): Promise<Message[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Message[];
}

export async function deleteMessage(id: string): Promise<{ error: unknown }> {
  if (!supabase) return { error: new Error('Supabase client not configured') };
  return supabase.from('contact_messages').delete().eq('id', id);
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as AdminProject[];
}

export async function upsertProject(project: Partial<AdminProject>): Promise<{ error: unknown }> {
  if (!supabase) return { error: new Error('Supabase client not configured') };
  if (project.id) {
    const { id, ...rest } = project;
    return supabase.from('projects').update(rest).eq('id', id);
  }
  return supabase.from('projects').insert(project);
}

export async function deleteProject(id: string): Promise<{ error: unknown }> {
  if (!supabase) return { error: new Error('Supabase client not configured') };
  return supabase.from('projects').delete().eq('id', id);
}

export async function getProjectComments(projectId: string): Promise<ProjectComment[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('project_comments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  return (data ?? []) as ProjectComment[];
}

export async function deleteComment(id: string): Promise<{ error: unknown }> {
  if (!supabase) return { error: new Error('Supabase client not configured') };
  return supabase.from('project_comments').delete().eq('id', id);
}

export async function uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
  if (!supabase) return null;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) { console.error('Upload error:', error); return null; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
