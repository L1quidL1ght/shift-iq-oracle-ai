// Temporary type definitions while Supabase types update
export interface Profile {
  id: string;
  email: string;
  role: 'staff' | 'content_admin' | 'super_admin';
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
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Beer {
  id: string;
  name: string;
  brewery: string | null;
  style: string | null;
  abv: number | null;
  ibu: number | null;
  taste_profile: string | null;
  similar_to: string[] | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string | null;
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