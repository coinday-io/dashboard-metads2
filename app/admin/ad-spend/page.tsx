import { PageChrome } from '@/components/page-chrome';
import { Button, Card, Input } from '@/components/ui';
import { adSpendReports } from '@/lib/data';
import { currency } from '@/lib/format';
import { Upload } from 'lucide-react';

export default function AdSpendPage() {
  return (
    <PageChrome title="Meta Ads Spend" subtitle="Manual spend import matched to UTM campaign, content, and term." action={<Button><Upload className="h-4 w-4" />Import CSV</Button>}>
      <Card className="mb-4 grid gap-3 p-4 md:grid-cols-5"><Input value="2026-04-27" /><Input placeholder="Campaign name" /><Input placeholder="Spend" /><Input placeholder="Link clicks" /><Button>Save report</Button></Card>
      <Card className="overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Date', 'Campaign', 'Ad set', 'Ad', 'Spend', 'Impressions', 'Link clicks', 'LP views'].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{adSpendReports.map((row) => <tr key={row.id}><td className="px-5 py-4">{row.reportDate}</td><td className="px-5 py-4 font-semibold text-meta">{row.campaignName}</td><td className="px-5 py-4">{row.adsetName}</td><td className="px-5 py-4">{row.adName}</td><td className="px-5 py-4">{currency(row.spend)}</td><td className="px-5 py-4">{row.impressions.toLocaleString()}</td><td className="px-5 py-4">{row.linkClicks}</td><td className="px-5 py-4">{row.landingPageViews}</td></tr>)}</tbody></table></Card>
    </PageChrome>
  );
}
