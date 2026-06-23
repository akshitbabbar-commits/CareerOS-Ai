'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingChatbot } from '@/components/chat/FloatingChatbot';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        {children}
        <FloatingChatbot />
      </AuthProvider>
    </ThemeProvider>
  );
}

