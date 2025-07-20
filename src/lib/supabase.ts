
import { createClient } from '@supabase/supabase-js';

// Using Lovable's native Supabase integration
// These values are automatically provided when connected to Supabase
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
