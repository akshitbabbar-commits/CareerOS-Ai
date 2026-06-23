'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Login
        </Link>

        <Card variant="glass" padding="lg" className="border border-[var(--card-border)] shadow-2xl">
          <CardContent className="space-y-6">
            {!submitted ? (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-bg text-white font-bold text-lg mb-2 shadow-lg shadow-primary-500/20">
                    C
                  </div>
                  <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Reset Password</h1>
                  <p className="text-xs text-[var(--muted)]">Enter your email and we'll send reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={16} />}
                    required
                  />

                  <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
                    Send Reset Link
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
                  <CheckCircle size={36} />
                </div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Check your inbox</h1>
                <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm mx-auto">
                  We have sent password reset instructions to <strong>{email}</strong>. Please check your junk/spam folder if you do not receive it in a few minutes.
                </p>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="secondary" size="md">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
