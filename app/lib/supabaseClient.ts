import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_SUPABASE_API_URL;
const supabaseKey = process.env.NEXT_SUPABASE_API_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_SUPABASE_API_URL environment variable.');
}

if (!supabaseKey) {
  throw new Error('Missing NEXT_SUPABASE_API_KEY environment variable.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

