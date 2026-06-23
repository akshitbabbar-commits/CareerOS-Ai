'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { Avatar } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Home, Sparkles, LayoutDashboard, FileText, Target, Map, Mic, Bot,
  Sun, Moon, Menu, X, LogOut, User, Settings, ChevronDown,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home, Sparkles, LayoutDashboard, FileText, Target, Map, Mic, Bot,
};

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/resume') ||
    pathname.startsWith('/skill') || pathname.startsWith('/roadmap') || pathname.startsWith('/mock') ||
    pathname.startsWith('/ai-mentor') || pathname.startsWith('/job-prep') || pathname.startsWith('/projects') ||
    pathname.startsWith('/profile') || pathname.startsWith('/settings');

  if (isDashboardPage && isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
              C
            </div>
            <span className="font-bold text-lg font-[family-name:var(--font-heading)]">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`nav-${item.label.toLowerCase()}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-all duration-200"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-all"
                  id="profile-menu-trigger"
                >
                  <Avatar name={user?.fullName || 'User'} size="sm" />
                  <ChevronDown size={14} className={`text-[var(--muted)] transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl z-50 py-2 animate-scale-in">
                      <div className="px-4 py-2 border-b border-[var(--divider)]">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-[var(--muted)]">{user?.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors" onClick={() => setProfileMenuOpen(false)}>
                        <User size={16} /> Profile
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors" onClick={() => setProfileMenuOpen(false)}>
                        <Settings size={16} /> Settings
                      </Link>
                      <div className="border-t border-[var(--divider)] mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setProfileMenuOpen(false); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" id="nav-login">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" id="nav-signup">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-all"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--divider)] bg-[var(--card-bg)] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  {item.label}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-[var(--divider)] space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
