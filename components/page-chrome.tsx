import type { ReactNode } from 'react';

export function PageChrome({ title, subtitle, action, children }: { title: string; subtitle: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>
        {action}
      </div>
      {children}
    </div>
  );
}
