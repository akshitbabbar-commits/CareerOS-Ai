'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, Lock, Mail, ArrowLeft, Sparkles } from 'lucide-react';



export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await signup(email, password, fullName);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      console.error('[signup] Error:', err);
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <Card variant="glass" padding="lg" className="border border-[var(--card-border)] shadow-2xl">
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-bg text-white font-bold text-lg mb-2 shadow-lg shadow-primary-500/20">
                C
              </div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Get Started Free</h1>
              <p className="text-xs text-[var(--muted)]">Build your profile and design your roadmap</p>
            </div>

            {error && (
              <Badge variant="danger" className="w-full justify-center py-2 rounded-xl">
                {error}
              </Badge>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User size={16} />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
              />

              <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
                Create Account
              </Button>
            </form>



            <p className="text-center text-xs text-[var(--muted)] mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-500 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
