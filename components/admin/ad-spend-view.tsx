'use client';

import { PageChrome } from '@/components/page-chrome';
import { Button, Card, Input } from '@/components/ui';
import type { AdSpendReport } from '@/lib/types';
import { currency } from '@/lib/format';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const empty = { report_date: new Date().toISOString().slice(0, 10), campaign_name: '', adset_name: '', ad_name: '', utm_campaign: '', utm_content: '', spend: '', impressions: '', link_clicks: '', landing_page_views: '' };

export function AdSpendView({ initialRows }: { initialRows: AdSpendReport[] }) {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch('/api/ad-spend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_date: form.report_date,
        campaign_name: form.campaign_name,
        adset_name: form.adset_name || undefined,
        ad_name: form.ad_name || undefined,
        utm_campaign: form.utm_campaign || undefined,
        utm_content: form.utm_content || undefined,
        spend: Number(form.spend || 0),
        impressions: Number(form.impressions || 0),
        link_clicks: Number(form.link_clicks || 0),
        landing_page_views: Number(form.landing_page_views || 0),
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error?.message ?? 'Failed to save report');
      return;
    }
    setForm(empty);
    router.refresh();
  }

  return (
    <PageChrome title="Meta Ads Spend" subtitle="Manual spend import matched to UTM campaign, content, and term." action={<Button form="ad-spend-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save report'}</Button>}>
      <Card className="mb-4 p-4">
        <form id="ad-spend-form" className="grid gap-3 md:grid-cols-5" onSubmit={handleSubmit}>
          <Input type="date" value={form.report_date} onChange={(e) => setForm({ ...form, report_date: e.target.value })} required />
          <Input placeholder="Campaign name" value={form.campaign_name} onChange={(e) => setForm({ ...form, campaign_name: e.target.value })} required />
          <Input placeholder="UTM campaign" value={form.utm_campaign} onChange={(e) => setForm({ ...form, utm_campaign: e.target.value })} />
          <Input type="number" step="0.01" placeholder="Spend (USD)" value={form.spend} onChange={(e) => setForm({ ...form, spend: e.target.value })} required />
          <Input type="number" placeholder="Link clicks" value={form.link_clicks} onChange={(e) => setForm({ ...form, link_clicks: e.target.value })} />
          <Input placeholder="Ad set" value={form.adset_name} onChange={(e) => setForm({ ...form, adset_name: e.target.value })} />
          <Input placeholder="Ad" value={form.ad_name} onChange={(e) => setForm({ ...form, ad_name: e.target.value })} />
          <Input placeholder="UTM content" value={form.utm_content} onChange={(e) => setForm({ ...form, utm_content: e.target.value })} />
          <Input type="number" placeholder="Impressions" value={form.impressions} onChange={(e) => setForm({ ...form, impressions: e.target.value })} />
          <Input type="number" placeholder="Landing page views" value={form.landing_page_views} onChange={(e) => setForm({ ...form, landing_page_views: e.target.value })} />
          {error ? <p className="md:col-span-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        </form>
      </Card>
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Date', 'Campaign', 'Ad set', 'Ad', 'Spend', 'Impressions', 'Link clicks', 'LP views'].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {initialRows.map((row) => (
              <tr key={row.id}>
                <td className="px-5 py-4">{row.reportDate}</td>
                <td className="px-5 py-4 font-semibold text-meta">{row.campaignName}</td>
                <td className="px-5 py-4">{row.adsetName}</td>
                <td className="px-5 py-4">{row.adName}</td>
                <td className="px-5 py-4">{currency(row.spend)}</td>
                <td className="px-5 py-4">{row.impressions.toLocaleString()}</td>
                <td className="px-5 py-4">{row.linkClicks}</td>
                <td className="px-5 py-4">{row.landingPageViews}</td>
              </tr>
            ))}
            {initialRows.length === 0 ? <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500">Belum ada laporan ad spend. Tambahkan baris pertama lewat form di atas.</td></tr> : null}
          </tbody>
        </table>
      </Card>
    </PageChrome>
  );
}
