-- Enable required extensions for ShiftIQ
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to dependencies)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.document_embeddings CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.beers CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Users profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'staff' check (role in ('super_admin', 'content_admin', 'staff')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Documents table for internal knowledge base
CREATE TABLE public.documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  category text not null,
  tags text[] default '{}',
  file_type text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Document embeddings for vector search
CREATE TABLE public.document_embeddings (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade,
  content_chunk text not null,
  chunk_index integer not null,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Beer list management
CREATE TABLE public.beers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  style text not null,
  abv decimal(3,1),
  ibu integer,
  taste_profile text,
  brewery text not null,
  similar_to text,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Chat history
CREATE TABLE public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade,
  message_type text not null check (message_type in ('user', 'assistant')),
  content text not null,
  source_type text check (source_type in ('internal', 'gpt4_fallback')),
  source_documents jsonb,
  is_bookmarked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- System settings
CREATE TABLE public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Anyone can view documents" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage documents" ON public.documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('content_admin', 'super_admin')
    )
  );

-- Document embeddings policies
CREATE POLICY "Anyone can view embeddings" ON public.document_embeddings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage embeddings" ON public.document_embeddings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('content_admin', 'super_admin')
    )
  );

-- Beers policies
CREATE POLICY "Anyone can view beers" ON public.beers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage beers" ON public.beers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('content_admin', 'super_admin')
    )
  );

-- Chat sessions policies
CREATE POLICY "Users can view own sessions" ON public.chat_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Chat messages policies
CREATE POLICY "Users can view messages in own sessions" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own sessions" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- System settings policies
CREATE POLICY "Anyone can view system settings" ON public.system_settings
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage system settings" ON public.system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'staff');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_beers_updated_at
  BEFORE UPDATE ON public.beers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX idx_document_embeddings_document_id ON public.document_embeddings(document_id);
CREATE INDEX idx_document_embeddings_embedding ON public.document_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_beers_style ON public.beers(style);
CREATE INDEX idx_beers_active ON public.beers(is_active);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);

-- Insert initial system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('app_name', '"ShiftIQ"', 'Application name'),
('openai_api_key', '""', 'OpenAI API key for GPT-4 fallback'),
('vector_search_threshold', '0.7', 'Minimum similarity threshold for vector search'),
('max_chat_history', '100', 'Maximum number of chat messages to keep per session');