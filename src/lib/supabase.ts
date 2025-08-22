import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Environment variables validation
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

// Validate environment variables (only in runtime, not during build)
const validateEnvVars = () => {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      console.warn('Missing Supabase environment variables. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
  }
};

validateEnvVars();

// Client-side Supabase client
export const createClient = () => {
  // Return a mock client if environment variables are not available (during build)
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    return null as any; // This will be caught in runtime
  }
  
  return createBrowserClient<Database>(
    supabaseConfig.url,
    supabaseConfig.anonKey
  );
};
