import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tybqkpixxgihazbluahv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YnFrcGl4eGdpaGF6Ymx1YWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MTI5NzcsImV4cCI6MjEwNzQ4ODk3N30.4uifmuF8EhTVNyqB6s5qpD4qV7Iyr-i8FmIqapfaeYE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const DEFAULT_ORG_ID = '00000000-0000-0000-0000-000000000001';
