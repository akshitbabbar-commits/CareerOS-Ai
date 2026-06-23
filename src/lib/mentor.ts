import { supabase } from './supabase';

export interface DbChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string representation
}

export interface DbChatHistory {
  id?: string;
  user_id: string;
  session_type: string;
  messages: DbChatMessage[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Retrieves the chat history list for a user and session type.
 */
export async function getChatHistory(
  userId: string,
  sessionType: string = 'mentor'
): Promise<DbChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .eq('session_type', sessionType)
    .maybeSingle();

  if (error) {
    console.error('[mentor] Error fetching chat history:', error);
    throw new Error(error.message || 'Failed to fetch conversation history');
  }

  return data ? (data.messages as DbChatMessage[]) : [];
}

/**
 * Saves or updates the chat history list for a user and session type.
 */
export async function saveChatHistory(
  userId: string,
  sessionType: string = 'mentor',
  messages: DbChatMessage[]
): Promise<void> {
  const { error } = await supabase
    .from('chat_history')
    .upsert(
      {
        user_id: userId,
        session_type: sessionType,
        messages: messages,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,session_type' }
    );

  if (error) {
    console.error('[mentor] Error saving chat history:', error);
    throw new Error(error.message || 'Failed to save conversation history');
  }
}
