import { BuilderPreview } from '@/components/builder';
import { PerformanceChart } from '@/components/charts';
import { Badge, Card, Select, Toggle } from '@/components/ui';
import { getDashboardMetrics } from '@/lib/db';
import { currency } from '@/lib/format';
import { CalendarDays, TrendingDown, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const { metrics, campaigns, chart } = await getDashboardMetrics();
  const metricCards = [
    { label: 'CTR (Link)', value: `${metrics.ctr}%`, trend: '↑ 18.6%', direction: 'up' as const, favorable: true },
    { label: 'CPC (Link)', value: currency(metrics.cpc), trend: '↓ 8.7%', direction: 'down' as const, favorable: true },
    { label: 'Clicks (Link)', value: metrics.clicks.toLocaleString(), trend: '↑ 21.3%', direction: 'up' as const, favorable: true },
    { label: 'Conversions', value: metrics.conversions.toLocaleString(), trend: '↑ 24.8%', direction: 'up' as const, favorable: true },
    { label: 'ROAS (Purchase)', value: metrics.roas.toFixed(2), trend: '↑ 31.5%', direction: 'up' as const, favorable: true },
  ];
  return (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 2xl:grid-cols-[1fr_1.2fr]">
      <section className="border-r border-slate-200 p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Overview</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium"><CalendarDays className="h-4 w-4" />May 12 – May 18, 2025</button>
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium">vs. May 5 – May 11, 2025</button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {metricCards.map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-xs font-medium text-slate-500">{metric.label}</p>
              <div className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</div>
              <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${metric.favorable ? 'text-emerald-600' : 'text-red-600'}`}>{metric.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{metric.trend}</div>
              <svg viewBox="0 0 120 30" className="mt-1 h-8 w-full"><polyline fill="none" stroke="#0866ff" strokeWidth="2" points="0,24 18,21 30,16 44,18 57,15 70,20 86,16 100,18 112,10 120,14" /></svg>
            </Card>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <Card className="p-5"><h2 className="mb-3 font-bold">Performance Over Time</h2><PerformanceChart points={chart} /></Card>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Top Campaigns</h2><Select><option>By ROAS</option><option>By Clicks</option></Select></div>
            <div className="space-y-4">
              {campaigns.map((campaign) => <div key={campaign.name}><div className="mb-1 flex justify-between text-xs font-semibold"><span>{campaign.name}</span><span>{campaign.roas.toFixed(2)}</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(campaign.roas * 17, 100)}%` }} /></div></div>)}
            </div>
            <button className="mt-5 w-full rounded-lg border border-slate-200 py-2 text-sm font-semibold text-meta">View all campaigns</button>
          </Card>
        </div>
        <Card className="mt-4 overflow-hidden">
          <div className="border-b border-slate-200 p-4 text-lg font-bold">Campaigns</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500"><tr>{['', 'Campaign', 'Delivery', 'Budget', 'Results', 'CTR (Link)', 'CPC (Link)', 'ROAS (Purchase)'].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign) => <tr key={campaign.name}><td className="px-4 py-3"><Toggle active={campaign.delivery === 'Active'} /></td><td className="px-4 py-3 font-semibold text-meta">{campaign.name}</td><td className="px-4 py-3"><Badge tone={campaign.delivery === 'Active' ? 'green' : 'gray'}>{campaign.delivery}</Badge></td><td className="px-4 py-3">{currency(campaign.budget)}</td><td className="px-4 py-3">{campaign.conversions.toLocaleString()} conv.</td><td className="px-4 py-3">{campaign.ctr.toFixed(2)}%</td><td className="px-4 py-3">{currency(campaign.cpc)}</td><td className="px-4 py-3">{campaign.roas.toFixed(2)}</td></tr>)}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
      <section className="p-7"><BuilderPreview /></section>
    </div>
  );
}
