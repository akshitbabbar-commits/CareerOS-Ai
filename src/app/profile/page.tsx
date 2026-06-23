'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Badge, Avatar } from '@/components/ui/Badge';
import {
  ArrowLeft, User, GraduationCap, Briefcase, Plus, X,
  Save, Check, Mail, MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { profile, isAuthenticated, isLoading, updateProfile } = useAuth();
  const router = useRouter();

  // Profile forms state
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear());
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // Tag list state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Feedback states
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load fields when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setCollege(profile.college || '');
      setGraduationYear(profile.graduationYear || new Date().getFullYear());
      let parsedSkills: string[] = [];
      if (Array.isArray(profile.skills)) {
        parsedSkills = profile.skills;
      } else if (typeof profile.skills === 'string') {
        parsedSkills = (profile.skills as string).split(',').map((s) => s.trim()).filter(Boolean);
      }
      setSkills(parsedSkills);
      setTargetRole(profile.targetRole || '');
      setLocation(profile.location || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  if (isLoading || !isAuthenticated || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setIsSaved(false);

    try {
      await updateProfile({
        fullName,
        college,
        graduationYear: Number(graduationYear),
        skills,
        targetRole,
        location,
        bio,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error('[profile] Save profile failed:', err);
      setErrorMsg(err.message || 'Failed to save changes. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--foreground)]">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-[var(--foreground)]">User Profile</h1>
              <p className="text-xs text-[var(--muted)]">Manage your education, skills, and target career goals</p>
            </div>
          </div>
        </div>

        {/* Profile Card Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Avatar & Summary */}
          <Card variant="glass" className="lg:col-span-4 p-6 border border-[var(--card-border)] text-center flex flex-col items-center justify-center space-y-4">
            <Avatar name={fullName} size="xl" className="shadow-lg shadow-primary-500/20" />
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-[var(--foreground)]">{fullName || 'User Profile'}</h3>
              <p className="text-xs text-[var(--muted)]">{profile.email}</p>
            </div>
            <div className="border-t border-[var(--divider)] pt-4 w-full text-xs text-left space-y-3 text-[var(--foreground)]">
              {college && (
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-primary-500 shrink-0" />
                  <span>{college} ({graduationYear})</span>
                </div>
              )}
              {targetRole && (
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-primary-500 shrink-0" />
                  <span>Targeting {targetRole}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary-500 shrink-0" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Right Column: Edit form fields */}
          <div className="lg:col-span-8 space-y-6">
            <Card variant="default" className="border border-[var(--card-border)] shadow-sm">
              <CardHeader className="border-b border-[var(--divider)] py-4 px-6">
                <CardTitle className="text-base font-bold text-[var(--foreground)]">Personal Details</CardTitle>
                <CardDescription>Update your general and education descriptors</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    value={profile.email}
                    disabled
                    readOnly
                    className="opacity-60 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Target Role"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Product Manager"
                  />
                  <Input
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="College / University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                  <Input
                    label="Graduation Year"
                    type="number"
                    value={graduationYear || ''}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <TextArea
                    label="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself, your career goals, and what you're working on..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tag Editor: Skills */}
            <Card variant="default" className="border border-[var(--card-border)] shadow-sm">
              <CardHeader className="border-b border-[var(--divider)]/50 py-4 px-6">
                <CardTitle className="text-base font-bold text-[var(--foreground)]">Skills</CardTitle>
                <CardDescription>Press Enter to add new items as custom tags</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Input
                    label="Key Skills"
                    placeholder="Type skill and press Enter (e.g. PyTorch, React)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((skill, idx) => (
                      <Badge key={idx} variant="primary" className="flex items-center gap-1 py-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-primary-500/20 rounded-full p-0.5"
                        >
                          <X size={10} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 border-t border-[var(--divider)]/50 bg-[var(--background)]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 text-left">
                  {errorMsg && (
                    <p className="text-xs text-red-500 font-medium">
                      ⚠️ {errorMsg}
                    </p>
                  )}
                  {isSaved && (
                    <span className="text-xs text-emerald-500 flex items-center gap-1.5 font-semibold">
                      <Check size={14} /> Profile saved successfully!
                    </span>
                  )}
                </div>
                <div className="flex justify-end gap-3 w-full sm:w-auto">
                  <Button type="submit" disabled={isSaving} className="flex items-center gap-1.5 w-full sm:w-auto justify-center">
                    {isSaving ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
