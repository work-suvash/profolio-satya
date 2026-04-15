import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase env vars not set. Database features will be unavailable.');
    return null;
  }
  if (!isValidHttpUrl(supabaseUrl)) {
    console.warn(`Supabase env var NEXT_PUBLIC_SUPABASE_URL is not a valid HTTP/HTTPS URL ("${supabaseUrl}"). Database features will be unavailable.`);
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialise Supabase client. Database features will be unavailable.', err);
    return null;
  }
}

export const supabase: SupabaseClient | null = createSupabaseClient();
