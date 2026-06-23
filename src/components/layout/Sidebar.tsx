'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { DASHBOARD_NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { Avatar } from '@/components/ui/Badge';
import {
  LayoutDashboard, FileText, Target, Map, Mic, Bot, Briefcase,
  FolderKanban, User, Settings, Sun, Moon, LogOut, ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard, FileText, Target, Map, Mic, Bot, Briefcase,
  FolderKanban, User, Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] z-40 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
      id="dashboard-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-[var(--divider)]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            C
          </div>
          {!collapsed && (
            <span className="font-bold text-base font-[family-name:var(--font-heading)] whitespace-nowrap">
              {APP_NAME}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {DASHBOARD_NAV_ITEMS.map((item, index) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          const isSection = index === 0 || index === 7; // Dashboard, Profile section dividers

          return (
            <div key={item.href}>
              {index === 7 && <div className="my-3 border-t border-[var(--divider)]" />}
              <Link
                href={item.href}
                id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'text-primary-500 bg-primary-500/10 shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {Icon && (
                  <Icon
                    size={20}
                    className={`flex-shrink-0 ${isActive ? 'text-primary-500' : 'group-hover:text-[var(--foreground)]'}`}
                  />
                )}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-3 border-t border-[var(--divider)] space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-all"
          id="sidebar-theme-toggle"
        >
          {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-all"
          id="sidebar-collapse-toggle"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User Info */}
        {user && (
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--muted-bg)] ${collapsed ? 'justify-center' : ''}`}>
            <Avatar name={user.fullName} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-[var(--muted)] truncate">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

// Mobile Bottom Nav for dashboard pages
export function MobileBottomNav() {
  const pathname = usePathname();
  const mobileItems = DASHBOARD_NAV_ITEMS.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--card-border)]" id="mobile-bottom-nav">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-primary-500' : 'text-[var(--muted)]'
              }`}
            >
              {Icon && <Icon size={20} />}
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            pathname === '/settings' ? 'text-primary-500' : 'text-[var(--muted)]'
          }`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-medium">More</span>
        </Link>
      </div>
    </nav>
  );
}
