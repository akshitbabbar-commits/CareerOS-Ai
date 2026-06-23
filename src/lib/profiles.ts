import { supabase } from './supabase';

// ---- Types matching the Supabase `profiles` table ----

/** Row shape in `public.profiles`. */
export interface DbProfile {
  id: string;
  full_name: string;
  email: string;
  target_role?: string | null;
  college?: string | null;
  graduation_year?: number | null;
  skills?: string | string[] | null;
  location?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Helper functions ----

/**
 * Fetch a profile by user ID.
 * Returns `null` if the row doesn't exist (e.g. legacy user).
 */
export async function getProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    // PGRST116 = "no rows returned" — not a real error, just means no profile yet
    if (error.code === 'PGRST116') {
      console.warn('[profiles] No profile row found for user:', userId);
      return null;
    }
    console.error('[profiles] Error fetching profile:', error);
    return null;
  }

  return data as DbProfile;
}

/**
 * Create a profile row for a newly signed-up user.
 * Uses `upsert` with `onConflict: 'id'` so calling this twice is safe.
 */
export async function createProfile(
  userId: string,
  fullName: string,
  email: string,
): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        full_name: fullName,
        email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single();

  if (error) {
    console.error('[profiles] Error creating profile:', error);
    return null;
  }

  return data as DbProfile;
}

/**
 * Partially update a profile row.
 * Only the provided fields are overwritten; the rest are untouched.
 */
export async function updateProfileRow(
  userId: string,
  updates: Partial<Omit<DbProfile, 'id' | 'created_at'>>,
): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('[profiles] Error updating profile:', error);
    return null;
  }

  return data as DbProfile;
}
