'use client';

import { PageChrome } from '@/components/page-chrome';
import { Button, Card, Input, Textarea } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Settings = {
  site_name?: string;
  site_url?: string;
  default_disclosure_text?: string;
  meta_pixel_id?: string;
  ga4_measurement_id?: string;
  global_head_script?: string;
  global_body_script?: string;
};

export function SettingsView({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    const res = await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error?.message ?? 'Failed to save settings');
      return;
    }
    setMessage('Settings saved.');
    router.refresh();
  }

  return (
    <PageChrome title="Settings" subtitle="Configure site branding, disclosures, GA4, and Meta Pixel scripts." action={<Button form="settings-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>}>
      <Card className="max-w-3xl space-y-4 p-6">
        <form id="settings-form" className="space-y-4" onSubmit={handleSubmit}>
          <Input placeholder="Site name" value={form.site_name ?? ''} onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
          <Input placeholder="Site URL (https://yourdomain.com)" value={form.site_url ?? ''} onChange={(e) => setForm({ ...form, site_url: e.target.value })} />
          <Textarea placeholder="Default affiliate disclosure" value={form.default_disclosure_text ?? ''} onChange={(e) => setForm({ ...form, default_disclosure_text: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Meta Pixel ID" value={form.meta_pixel_id ?? ''} onChange={(e) => setForm({ ...form, meta_pixel_id: e.target.value })} />
            <Input placeholder="GA4 Measurement ID (G-XXXX)" value={form.ga4_measurement_id ?? ''} onChange={(e) => setForm({ ...form, ga4_measurement_id: e.target.value })} />
          </div>
          <Textarea placeholder="Custom <head> script (optional)" value={form.global_head_script ?? ''} onChange={(e) => setForm({ ...form, global_head_script: e.target.value })} />
          <Textarea placeholder="Custom <body> script (optional)" value={form.global_body_script ?? ''} onChange={(e) => setForm({ ...form, global_body_script: e.target.value })} />
          {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
        </form>
      </Card>
    </PageChrome>
  );
}
