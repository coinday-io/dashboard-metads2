import { PageChrome } from '@/components/page-chrome';
import { Badge, Button, Card, Input, Select } from '@/components/ui';
import { clickEvents } from '@/lib/data';
import { Download } from 'lucide-react';

export default function ClicksPage() {
  return (
    <PageChrome title="Click Events" subtitle="Filter redirect clicks by date, product, campaign, and landing page." action={<Button variant="secondary"><Download className="h-4 w-4" />Export CSV</Button>}>
      <Card className="mb-4 grid gap-3 p-4 md:grid-cols-4"><Input placeholder="Search campaign or slug" /><Select><option>All products</option></Select><Input value="2026-04-01 → 2026-04-28" /><Select><option>All devices</option></Select></Card>
      <Card className="overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Time', 'Product', 'Campaign', 'Content', 'Device', 'Country', 'Quality'].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{clickEvents.map((event) => <tr key={event.id}><td className="px-5 py-4">{new Date(event.createdAt).toLocaleString()}</td><td className="px-5 py-4 font-semibold text-meta">{event.productSlug}</td><td className="px-5 py-4">{event.utmCampaign}</td><td className="px-5 py-4">{event.utmContent}</td><td className="px-5 py-4">{event.deviceType}</td><td className="px-5 py-4">{event.country}</td><td className="px-5 py-4"><Badge tone={event.isDuplicate || event.isBot ? 'amber' : 'green'}>{event.isDuplicate ? 'duplicate' : event.isBot ? 'bot' : 'clean'}</Badge></td></tr>)}</tbody></table></Card>
    </PageChrome>
  );
}
