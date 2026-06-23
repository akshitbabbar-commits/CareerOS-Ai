import { supabase } from './supabase';
import { ResumeAnalysis } from '@/types';

/**
 * Saves a new resume analysis to Supabase.
 */
export async function saveResumeAnalysis(
  userId: string,
  analysis: Omit<ResumeAnalysis, 'id' | 'createdAt' | 'userId'>
): Promise<ResumeAnalysis> {
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      file_name: analysis.fileName,
      file_url: analysis.fileUrl || null,
      ats_score: analysis.atsScore,
      analysis: {
        formatting: analysis.formatting,
        keywords: analysis.keywords,
        grammar: analysis.grammar,
        impact: analysis.impact,
        suggestions: analysis.suggestions,
        missingSkills: analysis.missingSkills
      }
    })
    .select()
    .single();

  if (error) {
    console.error('[resumes] Error saving resume analysis:', error);
    throw new Error(error.message || 'Failed to save resume analysis to database');
  }

  return {
    id: data.id,
    userId: data.user_id,
    fileName: data.file_name,
    fileUrl: data.file_url || undefined,
    atsScore: data.ats_score,
    formatting: data.analysis.formatting,
    keywords: data.analysis.keywords,
    grammar: data.analysis.grammar,
    impact: data.analysis.impact,
    suggestions: data.analysis.suggestions,
    missingSkills: data.analysis.missingSkills,
    createdAt: data.created_at
  };
}

/**
 * Fetches all past resume analyses for a given user.
 */
export async function getUserResumes(userId: string): Promise<ResumeAnalysis[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[resumes] Error fetching resume history:', error);
    throw new Error(error.message || 'Failed to fetch resume history');
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    fileName: row.file_name,
    fileUrl: row.file_url || undefined,
    atsScore: row.ats_score,
    formatting: row.analysis.formatting,
    keywords: row.analysis.keywords,
    grammar: row.analysis.grammar,
    impact: row.analysis.impact,
    suggestions: row.analysis.suggestions,
    missingSkills: row.analysis.missingSkills,
    createdAt: row.created_at
  }));
}

/**
 * Deletes a specific resume analysis by its ID.
 */
export async function deleteResumeAnalysis(resumeId: string): Promise<void> {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId);

  if (error) {
    console.error('[resumes] Error deleting resume analysis:', error);
    throw new Error(error.message || 'Failed to delete resume analysis');
  }
}
