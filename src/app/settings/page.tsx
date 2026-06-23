'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft, Settings, Sun, Moon, Monitor, Bell, Shield,
  ChevronRight, Save, Check, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Security password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)]">Account Settings</h1>
              <p className="text-xs text-[var(--muted)]">Manage themes, notification configurations, and password security</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shortcut categories list */}
          <div className="lg:col-span-4 space-y-4">
            <Card variant="glass" className="border border-[var(--card-border)] p-4 space-y-1">
              <Link href="/profile" className="flex items-center justify-between p-3 hover:bg-[var(--hover-bg)]/50 rounded-xl text-xs transition-colors">
                <span className="font-bold">Edit Profile</span>
                <ChevronRight size={14} className="text-[var(--muted)]" />
              </Link>
              <button className="flex items-center justify-between w-full p-3 bg-primary-500/10 text-primary-500 rounded-xl text-xs text-left">
                <span className="font-bold">Preferences</span>
                <ChevronRight size={14} />
              </button>
            </Card>
          </div>

          {/* Right Column: Settings Sections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Theme selector */}
            <Card variant="default" className="border border-[var(--card-border)] shadow-sm">
              <CardHeader className="border-b border-[var(--divider)] py-4 px-6">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Monitor size={18} className="text-primary-500" />
                  Appearance & Design
                </CardTitle>
                <CardDescription>Select your light or dark mode preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {(['light', 'dark', 'system'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTheme(mode)}
                      className={`p-4 border rounded-2xl flex flex-col items-center gap-2 capitalize transition-all cursor-pointer ${
                        theme === mode
                          ? 'border-primary-500 bg-primary-500/5 text-primary-500 font-bold shadow-md shadow-primary-500/10'
                          : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]/50 text-[var(--muted)]'
                      }`}
                    >
                      {mode === 'light' && <Sun size={20} />}
                      {mode === 'dark' && <Moon size={20} />}
                      {mode === 'system' && <Monitor size={20} />}
                      <span className="text-xs">{mode} theme</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification preferences */}
            <form onSubmit={handleSavePreferences}>
              <Card variant="default" className="border border-[var(--card-border)] shadow-sm">
                <CardHeader className="border-b border-[var(--divider)] py-4 px-6">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Bell size={18} className="text-primary-500" />
                    Notification Toggles
                  </CardTitle>
                  <CardDescription>Customize where and when we send notifications</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 border border-[var(--card-border)] bg-[var(--background)]/20 rounded-2xl">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs">Email Alerts</h4>
                      <p className="text-[10px] text-[var(--muted)]">Send recommendations directly to inbox</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-[var(--card-border)] bg-[var(--background)]/20 rounded-2xl">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs">Interview Practice Reminders</h4>
                      <p className="text-[10px] text-[var(--muted)]">Remind to practice mock rounds weekly</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={interviewReminders}
                      onChange={(e) => setInterviewReminders(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-[var(--card-border)] bg-[var(--background)]/20 rounded-2xl">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs">Weekly Progress Report</h4>
                      <p className="text-[10px] text-[var(--muted)]">Digest of roadmap milestones and streak stats</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={weeklyReport}
                      onChange={(e) => setWeeklyReport(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-5 border-t border-[var(--divider)]/50 bg-[var(--background)]/20 flex justify-end gap-3">
                  {isSaved && (
                    <span className="text-xs text-emerald-500 flex items-center gap-1.5 font-semibold">
                      <Check size={14} /> Preferences Saved
                    </span>
                  )}
                  <Button type="submit" className="flex items-center gap-1.5 text-xs">
                    <Save size={16} /> Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </form>

            {/* Password security changer */}
            <form onSubmit={handleSaveSecurity}>
              <Card variant="default" className="border border-[var(--card-border)] shadow-sm">
                <CardHeader className="border-b border-[var(--divider)] py-4 px-6">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Shield size={18} className="text-primary-500" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Change password credentials</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-5 border-t border-[var(--divider)]/50 bg-[var(--background)]/20 flex justify-end">
                  <Button type="submit" className="flex items-center gap-1.5 text-xs">
                    <RefreshCw size={16} /> Update Password
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
