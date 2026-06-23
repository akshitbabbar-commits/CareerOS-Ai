/**
 * Supabase CRUD helpers for the `roadmaps` table.
 *
 * Table schema (already exists in Supabase):
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
 *   user_id       UUID REFERENCES profiles(id)
 *   career_goal   TEXT
 *   milestones    JSONB
 *   progress      INTEGER DEFAULT 0
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 *   updated_at    TIMESTAMPTZ DEFAULT NOW()
 */

import { supabase } from './supabase';
import type { Roadmap, Milestone } from '@/types';

// ---- DB row shape ----

export interface DbRoadmap {
  id: string;
  user_id: string;
  career_goal: string;
  milestones: Milestone[];
  progress: number;
  created_at: string;
  updated_at: string;
}

// ---- Converters ----

function dbToApp(row: DbRoadmap): Roadmap {
  const milestones: Milestone[] = Array.isArray(row.milestones) ? row.milestones : [];
  const totalTasks = milestones.reduce((s, m) => s + m.tasks.length, 0);
  const doneTasks = milestones.reduce(
    (s, m) => s + m.tasks.filter((t) => t.completed).length,
    0,
  );

  // Compute total duration from milestones
  let maxWeek = 0;
  for (const m of milestones) {
    const durMatch = m.duration.match(/(\d+)/);
    const dur = durMatch ? parseInt(durMatch[1], 10) : 2;
    const end = m.week + dur;
    if (end > maxWeek) maxWeek = end;
  }
  const totalWeeks = maxWeek > 0 ? maxWeek - 1 : 0;

  return {
    id: row.id,
    userId: row.user_id,
    careerGoal: row.career_goal,
    milestones,
    progress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    totalDuration: `${totalWeeks} week${totalWeeks !== 1 ? 's' : ''}`,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---- CRUD ----

/** Save (insert) a new roadmap. */
export async function saveRoadmap(
  userId: string,
  roadmap: Roadmap,
): Promise<Roadmap | null> {
  const { data, error } = await supabase
    .from('roadmaps')
    .insert({
      user_id: userId,
      career_goal: roadmap.careerGoal,
      milestones: roadmap.milestones,
      progress: roadmap.progress,
    })
    .select()
    .single();

  if (error) {
    console.error('[roadmaps] Error saving roadmap:', error);
    return null;
  }

  return dbToApp(data as DbRoadmap);
}

/** Fetch all roadmaps for a user, newest first. */
export async function getUserRoadmaps(userId: string): Promise<Roadmap[]> {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[roadmaps] Error fetching roadmaps:', error);
    return [];
  }

  return (data as DbRoadmap[]).map(dbToApp);
}

/** Fetch the most recent roadmap for a user. Returns null if none exist. */
export async function getLatestRoadmap(userId: string): Promise<Roadmap | null> {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // PGRST116 = no rows — not a real error
    if (error.code === 'PGRST116') return null;
    console.error('[roadmaps] Error fetching latest roadmap:', error);
    return null;
  }

  return dbToApp(data as DbRoadmap);
}

/** Update milestones (e.g. after toggling task completion). */
export async function updateRoadmapMilestones(
  roadmapId: string,
  milestones: Milestone[],
): Promise<boolean> {
  const totalTasks = milestones.reduce((s, m) => s + m.tasks.length, 0);
  const doneTasks = milestones.reduce(
    (s, m) => s + m.tasks.filter((t) => t.completed).length,
    0,
  );
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const { error } = await supabase
    .from('roadmaps')
    .update({
      milestones,
      progress,
      updated_at: new Date().toISOString(),
    })
    .eq('id', roadmapId);

  if (error) {
    console.error('[roadmaps] Error updating milestones:', error);
    return false;
  }

  return true;
}

/** Delete a roadmap by ID. */
export async function deleteRoadmap(roadmapId: string): Promise<boolean> {
  const { error } = await supabase
    .from('roadmaps')
    .delete()
    .eq('id', roadmapId);

  if (error) {
    console.error('[roadmaps] Error deleting roadmap:', error);
    return false;
  }

  return true;
}
