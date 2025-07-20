
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://zcjuzbj spjlcrclqrjhq.supabase.co';
const supabaseAnonKey = 'eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi3N1cGFiYXNlIiwicmVmIjoiemNqdXpianNwamxjcmNscXJqaHEiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzM5NDUwMywiZXhwIjoyMDUyOTcwNTAzfQ.L2a0K2JOJdEoRSUO-y24Tx_i_0H2rE-7SX8xJCkK2vU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  role: 'super_admin' | 'content_admin' | 'staff';
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  file_type: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DocumentEmbedding {
  id: string;
  document_id: string;
  content: string;
  embedding: number[];
  created_at: string;
}

export interface Beer {
  id: string;
  name: string;
  style: string;
  abv: number;
  ibu: number;
  brewery: string;
  taste_profile: string;
  similar_to: string[];
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
