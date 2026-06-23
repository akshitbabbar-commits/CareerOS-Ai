import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug logging — always prints so you can verify what Next.js loaded
console.log('Supabase URL:', supabaseUrl);
console.log('Anon key exists:', !!supabaseAnonKey);

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL missing');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
