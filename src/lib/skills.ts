import { supabase } from './supabase';
import type { SkillGapAnalysis } from '@/types';

export interface DbSkillGapAnalysis extends SkillGapAnalysis {
  id?: string;
  user_id: string;
  created_at?: string;
}

/**
 * Saves a skill gap analysis report to Supabase.
 */
export async function saveSkillGapAnalysis(
  userId: string,
  analysis: SkillGapAnalysis
): Promise<DbSkillGapAnalysis> {
  const { data, error } = await supabase
    .from('skill_gap_analyses')
    .insert({
      user_id: userId,
      target_role: analysis.targetRole,
      match_percentage: analysis.matchPercentage,
      readiness_level: analysis.readinessLevel,
      current_skills: analysis.currentSkills,
      required_skills: analysis.requiredSkills,
      missing_skills: analysis.missingSkills
    })
    .select()
    .single();

  if (error) {
    console.error('[skills] Error saving skill gap analysis:', error);
    throw new Error(error.message || 'Failed to save skill gap analysis');
  }

  return {
    targetRole: data.target_role,
    matchPercentage: data.match_percentage,
    readinessLevel: data.readiness_level,
    currentSkills: data.current_skills,
    requiredSkills: data.required_skills,
    missingSkills: data.missing_skills,
    id: data.id,
    user_id: data.user_id,
    created_at: data.created_at
  } as DbSkillGapAnalysis;
}

/**
 * Fetches the latest saved skill gap analysis for a target role and user.
 */
export async function getLatestSkillGapAnalysis(
  userId: string,
  targetRole: string
): Promise<SkillGapAnalysis | null> {
  const { data, error } = await supabase
    .from('skill_gap_analyses')
    .select('*')
    .eq('user_id', userId)
    .eq('target_role', targetRole)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[skills] Error fetching latest skill gap analysis:', error);
    throw new Error(error.message || 'Failed to fetch skill gap analysis');
  }

  if (!data) return null;

  return {
    targetRole: data.target_role,
    matchPercentage: data.match_percentage,
    readinessLevel: data.readiness_level,
    currentSkills: data.current_skills,
    requiredSkills: data.required_skills,
    missingSkills: data.missing_skills
  } as SkillGapAnalysis;
}
