import { PageChrome } from '@/components/page-chrome';
import { Button, Card, Input } from '@/components/ui';

export default function SettingsPage() {
  return <PageChrome title="Settings" subtitle="Configure site branding, disclosures, GA4, and Meta Pixel scripts." action={<Button>Save settings</Button>}><Card className="max-w-3xl space-y-4 p-6"><Input value="Affiliate Click Dashboard" /><Input value="https://yourdomain.com" /><textarea className="min-h-28 w-full rounded-lg border border-slate-200 p-3 text-sm" defaultValue="Beberapa link di halaman ini adalah link affiliate. Saya bisa menerima komisi jika kamu membeli melalui link tersebut, tanpa biaya tambahan untuk kamu." /><div className="grid gap-4 md:grid-cols-2"><Input placeholder="Meta Pixel ID" /><Input placeholder="GA4 Measurement ID" /></div></Card></PageChrome>;
}
