import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>{children}</section>;
}

export function Button({ children, className, variant = 'primary' }: { children: ReactNode; className?: string; variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
        variant === 'primary' && 'bg-meta text-white shadow-sm hover:bg-blue-700',
        variant === 'secondary' && 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'gray' | 'blue' | 'amber' }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    gray: 'bg-slate-100 text-slate-600 ring-slate-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  };
  return <span className={clsx('inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1', tones[tone])}>{children}</span>;
}

export function Input({ placeholder, value, className }: { placeholder?: string; value?: string; className?: string }) {
  return <input className={clsx('w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-meta focus:ring-2 focus:ring-blue-100', className)} placeholder={placeholder} defaultValue={value} />;
}

export function Select({ children, className }: { children: ReactNode; className?: string }) {
  return <select className={clsx('rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-meta', className)}>{children}</select>;
}

export function Toggle({ active = true }: { active?: boolean }) {
  return (
    <span className={clsx('relative inline-flex h-5 w-9 items-center rounded-full transition', active ? 'bg-meta' : 'bg-slate-300')}>
      <span className={clsx('h-4 w-4 rounded-full bg-white shadow transition', active ? 'translate-x-4' : 'translate-x-0.5')} />
    </span>
  );
}
