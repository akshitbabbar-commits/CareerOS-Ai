import { supabase } from './supabase';

export interface DbInterviewSession {
  id?: string;
  user_id: string;
  target_role: string;
  difficulty: string;
  interview_type: string;
  questions: { id: string; question: string; category: string }[];
  answers: Record<string, string>;
  scores: Record<string, {
    score: number;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    suggested_answer: string;
  }>;
  overall_score: number;
  summary_feedback: string;
  skills_to_improve: string[];
  created_at?: string;
}

/**
 * Saves a completed mock interview session to Supabase.
 */
export async function saveInterviewSession(
  userId: string,
  session: Omit<DbInterviewSession, 'user_id'>
): Promise<DbInterviewSession> {
  const { data, error } = await supabase
    .from('interview_sessions')
    .insert({
      user_id: userId,
      target_role: session.target_role,
      difficulty: session.difficulty,
      interview_type: session.interview_type,
      questions: session.questions,
      answers: session.answers,
      scores: session.scores,
      overall_score: session.overall_score,
      summary_feedback: session.summary_feedback,
      skills_to_improve: session.skills_to_improve
    })
    .select()
    .single();

  if (error) {
    console.error('[interviews] Error saving session to database:', error);
    throw new Error(error.message || 'Failed to save mock interview session');
  }
  return data as DbInterviewSession;
}

/**
 * Fetches all past mock interview sessions for a given user from Supabase.
 */
export async function getUserInterviews(userId: string): Promise<DbInterviewSession[]> {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[interviews] Error fetching session history:', error);
    throw new Error(error.message || 'Failed to fetch mock interview history');
  }
  return (data || []) as DbInterviewSession[];
}

/**
 * Deletes a past mock interview session from Supabase by its ID.
 */
export async function deleteInterviewSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('interview_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('[interviews] Error deleting session:', error);
    throw new Error(error.message || 'Failed to delete mock interview session');
  }
}
