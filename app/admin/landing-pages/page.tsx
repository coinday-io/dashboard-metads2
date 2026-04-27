import { PageChrome } from '@/components/page-chrome';
import { Badge, Button, Card } from '@/components/ui';
import { landingPages } from '@/lib/data';
import { ExternalLink, Plus } from 'lucide-react';

export default function LandingPagesAdmin() {
  return (
    <PageChrome title="Landing Pages" subtitle="Create curated affiliate landing pages and monitor button CTR." action={<Button><Plus className="h-4 w-4" />New landing page</Button>}>
      <div className="grid gap-4 xl:grid-cols-3">{landingPages.map((page) => <Card key={page.id} className="p-5"><div className="mb-4 flex items-start justify-between"><div><h2 className="font-bold">{page.title}</h2><p className="mt-1 text-sm text-slate-500">/rekomendasi/{page.slug}</p></div><Badge tone={page.status === 'published' ? 'green' : 'amber'}>{page.status}</Badge></div><p className="min-h-12 text-sm text-slate-600">{page.intro}</p><div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm"><div className="rounded-lg bg-slate-50 p-3"><b>{page.views.toLocaleString()}</b><span className="block text-xs text-slate-500">Views</span></div><div className="rounded-lg bg-slate-50 p-3"><b>{page.buttonClicks.toLocaleString()}</b><span className="block text-xs text-slate-500">Clicks</span></div><div className="rounded-lg bg-slate-50 p-3"><b>{page.ctr}%</b><span className="block text-xs text-slate-500">CTR</span></div></div><a href={`/rekomendasi/${page.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-meta">Preview <ExternalLink className="h-4 w-4" /></a></Card>)}</div>
    </PageChrome>
  );
}
