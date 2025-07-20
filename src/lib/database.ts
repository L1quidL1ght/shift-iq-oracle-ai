import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type Document = Tables<'documents'>;
type Beer = Tables<'beers'>;
type ChatSession = Tables<'chat_sessions'>;
type ChatMessage = Tables<'chat_messages'>;

// Profile functions
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const updateUserRole = async (profileId: string, role: Profile['role']) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', profileId);

  if (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Document functions
export const getDocuments = async (category?: string): Promise<Document[]> => {
  let query = supabase.from('documents').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data || [];
};

export const createDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('documents')
    .insert([document])
    .select()
    .single();

  if (error) {
    console.error('Error creating document:', error);
    throw error;
  }

  return data;
};

export const searchDocuments = async (query: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching documents:', error);
    return [];
  }

  return data || [];
};

// Beer functions
export const getBeers = async (style?: string): Promise<Beer[]> => {
  let query = supabase.from('beers').select('*');
  
  if (style) {
    query = query.eq('style', style);
  }
  
  const { data, error } = await query.order('name');

  if (error) {
    console.error('Error fetching beers:', error);
    return [];
  }

  return data || [];
};

export const searchBeers = async (query: string): Promise<Beer[]> => {
  const { data, error } = await supabase
    .from('beers')
    .select('*')
    .or(`name.ilike.%${query}%,brewery.ilike.%${query}%,style.ilike.%${query}%`)
    .order('name');

  if (error) {
    console.error('Error searching beers:', error);
    return [];
  }

  return data || [];
};

// Chat functions
export const getUserChatSessions = async (userId: string): Promise<ChatSession[]> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }

  return data || [];
};

export const createChatSession = async (userId: string, title: string): Promise<ChatSession> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId, title }])
    .select()
    .single();

  if (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }

  return data;
};

export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at');

  if (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }

  return data || [];
};

export const addChatMessage = async (
  sessionId: string,
  content: string,
  isUser: boolean
): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{ session_id: sessionId, content, is_user: isUser }])
    .select()
    .single();

  if (error) {
    console.error('Error adding chat message:', error);
    throw error;
  }

  return data;
};

// System settings functions
export const getSystemSetting = async (key: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching system setting:', error);
    return null;
  }

  return data?.value || null;
};

export const setSystemSetting = async (key: string, value: string, description?: string) => {
  const { error } = await supabase
    .from('system_settings')
    .upsert([{ key, value, description }]);

  if (error) {
    console.error('Error setting system setting:', error);
    throw error;
  }
};

// Document Processing and Vector Search
export const processDocument = async (documentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: { documentId }
    });

    if (error) {
      console.error('Error processing document:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('Error calling process-document function:', error);
    return false;
  }
};

export const sendChatMessage = async (
  message: string,
  sessionId: string
): Promise<{
  response: string;
  source: string;
  sourceDocuments: any[];
} | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { message, sessionId }
    });

    if (error) {
      console.error('Error sending chat message:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error calling chat function:', error);
    return null;
  }
};