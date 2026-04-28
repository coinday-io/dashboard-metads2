import { BarChart3, Bell, Blocks, ChevronDown, CreditCard, HelpCircle, Home, LogOut, Megaphone, MousePointer2, PanelLeftClose, Crosshair, Settings, Share2, Users } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from './ui';

const nav = [
  { icon: Home, label: 'Overview', href: '/admin' },
  { icon: Megaphone, label: 'Campaigns', href: '/admin/reports' },
  { icon: Blocks, label: 'Ad Sets', href: '/admin/ad-spend' },
  { icon: MousePointer2, label: 'Ads', href: '/admin/clicks' },
  { icon: Users, label: 'Audiences', href: '/admin/products' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
  { icon: Share2, label: 'Attribution', href: '/admin/landing-pages' },
  { icon: CreditCard, label: 'Billing', href: '/admin/api-keys' },
  { icon: Crosshair, label: 'Pixels', href: '/admin/settings' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[210px] flex-col bg-gradient-to-b from-[#111827] to-[#203246] px-2 py-5 text-white xl:flex">
        <div className="mb-8 flex items-center gap-2 px-3 text-2xl font-semibold">
          <span className="text-3xl leading-none text-[#35a5ff]">∞</span>
          <span>Meta</span>
          <ChevronDown className="ml-auto h-4 w-4 text-slate-300" />
        </div>
        <nav className="space-y-2">
          {nav.map((item, index) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${index === 0 ? 'bg-meta text-white shadow-lg shadow-blue-950/30' : 'text-slate-200 hover:bg-white/10'}`}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10"><HelpCircle className="h-5 w-5" />Help</Link>
          <form action="/api/auth/signout" method="post"><button type="submit" className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10"><LogOut className="h-5 w-5" />Sign out</button></form>
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200"><PanelLeftClose className="h-5 w-5" />Collapse</div>
        </div>
      </aside>
      <section className="xl:pl-[210px]">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-7 backdrop-blur">
          <div className="flex items-center gap-7">
            <Link href="/admin" className="text-xl font-bold">Ads Manager</Link>
            <button className="flex min-w-60 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm">Acme Growth <ChevronDown className="h-4 w-4" /></button>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Updated just now</span>
            <button className="rounded-lg p-2 hover:bg-slate-100">⟳</button>
            <Button variant="secondary" className="hidden md:inline-flex"><Share2 className="h-4 w-4" />Share</Button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700">•••</button>
            <div className="relative"><Bell className="h-5 w-5" /><span className="absolute -right-1 -top-2 rounded-full bg-meta px-1.5 text-[10px] font-bold text-white">3</span></div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">AV</div>
            <ChevronDown className="h-4 w-4 text-slate-700" />
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
