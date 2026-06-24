'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import {
  getProfile,
  createProfile as createDbProfile,
  updateProfileRow,
  type DbProfile,
} from '@/lib/profiles';
import type { Profile, User } from '@/types';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Default values for app-specific Profile fields not stored in DB ----
const PROFILE_DEFAULTS: Omit<Profile, 'id' | 'fullName' | 'email' | 'createdAt' | 'updatedAt'> = {
  college: '',
  degree: '',
  graduationYear: new Date().getFullYear(),
  skills: [],
  interests: [],
  careerGoal: '',
  experienceLevel: 'beginner',
  avatarUrl: undefined,
  targetRole: '',
  location: '',
  bio: '',
};

function parseSkills(skills: any): string[] {
  if (typeof skills === 'string') {
    return skills.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(skills)) {
    return skills.map((s) => String(s).trim()).filter(Boolean);
  }
  return [];
}

/** Convert a Supabase DB row into the app's Profile type. */
function dbProfileToAppProfile(db: DbProfile): Profile {
  return {
    ...PROFILE_DEFAULTS,
    id: db.id,
    fullName: db.full_name,
    email: db.email,
    college: db.college || '',
    graduationYear: db.graduation_year || new Date().getFullYear(),
    skills: parseSkills(db.skills),
    targetRole: db.target_role || '',
    location: db.location || '',
    bio: db.bio || '',
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

/** Map a Supabase session to the app's User type. */
function sessionToUser(session: Session): User {
  const { user: sbUser } = session;
  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    fullName:
      (sbUser.user_metadata?.full_name as string) ??
      sbUser.email ??
      '',
    createdAt: sbUser.created_at,
  };
}

/**
 * Load profile from Supabase. If the row doesn't exist yet
 * (e.g. user on first login), create it automatically.
 */
async function loadOrCreateProfile(appUser: User): Promise<Profile> {
  let dbRow = await getProfile(appUser.id);

  if (!dbRow) {
    console.log('[auth] No profile row found — creating one for', appUser.email);
    dbRow = await createDbProfile(appUser.id, appUser.fullName, appUser.email);
  }

  if (dbRow) {
    return dbProfileToAppProfile(dbRow);
  }

  // Absolute fallback: build a local-only profile so the app doesn't crash
  console.warn('[auth] Could not load or create profile — using local fallback');
  return {
    ...PROFILE_DEFAULTS,
    id: appUser.id,
    fullName: appUser.fullName,
    email: appUser.email,
    createdAt: appUser.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---- Bootstrap: restore session + profile on mount ----
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted && session) {
          const appUser = sessionToUser(session);
          setUser(appUser);
          const appProfile = await loadOrCreateProfile(appUser);
          if (mounted) setProfile(appProfile);
        }
      } catch (err) {
        console.error('[auth] Error restoring session:', err);
      }

      if (mounted) setIsLoading(false);
    }

    init();

    // ---- Listen for auth state changes (login / logout / token refresh) ----
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const appUser = sessionToUser(session);
        setUser(appUser);
        const appProfile = await loadOrCreateProfile(appUser);
        setProfile(appProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ---- Login ----
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
    // Profile is loaded by the onAuthStateChange listener.
  }, []);

  // ---- Signup ----
  const signup = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw new Error(error.message);

        // Create the profiles row immediately if we got a user back
        if (data.user) {
          console.log('[auth] Signup succeeded — creating profile row');
          await createDbProfile(data.user.id, fullName, email);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );



  // ---- Logout ----
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // State is cleared by the onAuthStateChange listener.
  }, []);

  // ---- Update profile (in-memory + DB) ----
  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!user) throw new Error('No authenticated user');

      const dbUpdates: Record<string, any> = {};
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.college !== undefined) dbUpdates.college = updates.college;
      if (updates.graduationYear !== undefined) dbUpdates.graduation_year = updates.graduationYear;
      if (updates.skills !== undefined) {
        dbUpdates.skills = Array.isArray(updates.skills)
          ? updates.skills.join(', ')
          : updates.skills || '';
      }
      if (updates.targetRole !== undefined) dbUpdates.target_role = updates.targetRole;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;

      if (Object.keys(dbUpdates).length > 0) {
        const result = await updateProfileRow(user.id, dbUpdates);
        if (!result) {
          throw new Error('Failed to save profile changes to Supabase');
        }
      }

      setProfile((prev) => {
        if (!prev) return null;
        return { ...prev, ...updates, updatedAt: new Date().toISOString() };
      });
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
