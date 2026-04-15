import { supabase } from './client';

export const trackProjectView = async (projectId: string) => {
  if (!supabase) return;
  try {
    const { data: existing } = await supabase
      .from('project_stats')
      .select('id, views')
      .eq('project_id', projectId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('project_stats')
        .update({ views: existing.views + 1 })
        .eq('project_id', projectId);
    } else {
      await supabase
        .from('project_stats')
        .insert({ project_id: projectId, views: 1, likes: 0 });
    }
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

export const toggleProjectLike = async (projectId: string, isLiked: boolean) => {
  if (!supabase) return;
  try {
    const { data: existing } = await supabase
      .from('project_stats')
      .select('id, likes')
      .eq('project_id', projectId)
      .maybeSingle();

    if (existing) {
      const newLikes = Math.max(0, existing.likes + (isLiked ? 1 : -1));
      await supabase
        .from('project_stats')
        .update({ likes: newLikes })
        .eq('project_id', projectId);
    } else {
      await supabase
        .from('project_stats')
        .insert({ project_id: projectId, views: 0, likes: isLiked ? 1 : 0 });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

export const addComment = async (projectId: string, author: string, text: string) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('project_comments')
      .insert({ project_id: projectId, author, text })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

export const getComments = async (projectId: string) => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};
