'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'bordered';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ className, variant = 'default', hoverable = true, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variant === 'default' && 'bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm',
        variant === 'glass' && 'glass-card',
        variant === 'gradient' && 'gradient-bg text-white',
        variant === 'bordered' && 'border-2 border-[var(--card-border)] bg-transparent',
        hoverable && variant !== 'gradient' && 'hover:shadow-lg hover:shadow-[var(--shadow-color)] hover:-translate-y-0.5',
        hoverable && variant === 'gradient' && 'hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold font-[family-name:var(--font-heading)]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-[var(--muted)]', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}
