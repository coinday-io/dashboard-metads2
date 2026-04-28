'use client';

import { PageChrome } from '@/components/page-chrome';
import { Badge, Button, Card, Input } from '@/components/ui';
import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Key = { id: string; name: string; key_prefix: string; scopes: string[]; status: string };

export function ApiKeysView({ initialKeys }: { initialKeys: Key[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState('products:read,reports:read');
  const [generated, setGenerated] = useState<{ name: string; key: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleGenerate() {
    setError(null);
    setSaving(true);
    const res = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, scopes: scopes.split(',').map((s) => s.trim()).filter(Boolean) }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error?.message ?? 'Failed to generate key');
      return;
    }
    setGenerated({ name: json.data.name, key: json.data.key });
    setName('');
    router.refresh();
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke API key ini? Klien yang masih memakainya akan langsung gagal.')) return;
    const res = await fetch(`/api/api-keys/${id}`, { method: 'POST' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json.error?.message ?? 'Gagal revoke');
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus permanen API key ini?')) return;
    const res = await fetch(`/api/api-keys/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json.error?.message ?? 'Gagal menghapus');
      return;
    }
    router.refresh();
  }

  return (
    <PageChrome title="API Keys" subtitle="Create scoped keys for trusted agents and automation." action={<Button onClick={handleGenerate} disabled={saving || !name}><Plus className="h-4 w-4" />Create key</Button>}>
      <Card className="mb-4 grid gap-3 p-4 md:grid-cols-3">
        <Input placeholder="Key name (e.g. Hermes Importer)" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="scopes (comma separated)" value={scopes} onChange={(e) => setScopes(e.target.value)} />
        <Button onClick={handleGenerate} disabled={saving || !name}><KeyRound className="h-4 w-4" />{saving ? 'Generating…' : 'Generate once'}</Button>
        {error ? <p className="md:col-span-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </Card>
      {generated ? (
        <Card className="mb-4 p-4">
          <p className="text-sm font-semibold">Salin sekarang — kunci ini hanya muncul sekali.</p>
          <p className="mt-1 text-xs text-slate-500">{generated.name}</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-slate-900 px-3 py-2 font-mono text-sm text-white">{generated.key}</code>
            <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(generated.key)}><Copy className="h-4 w-4" />Copy</Button>
          </div>
        </Card>
      ) : null}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Name', 'Prefix', 'Scopes', 'Status', ''].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {initialKeys.map((key) => (
              <tr key={key.id}>
                <td className="px-5 py-4 font-semibold">{key.name}</td>
                <td className="px-5 py-4 font-mono text-meta">{key.key_prefix}••••</td>
                <td className="px-5 py-4">{key.scopes.join(', ')}</td>
                <td className="px-5 py-4"><Badge tone={key.status === 'active' ? 'green' : 'red'}>{key.status}</Badge></td>
                <td className="px-5 py-4 text-right space-x-2">
                  {key.status === 'active' ? <Button variant="secondary" onClick={() => handleRevoke(key.id)}>Revoke</Button> : null}
                  <Button variant="danger" onClick={() => handleDelete(key.id)} aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
            {initialKeys.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">Belum ada API key. Generate yang pertama di form di atas.</td></tr> : null}
          </tbody>
        </table>
      </Card>
    </PageChrome>
  );
}
