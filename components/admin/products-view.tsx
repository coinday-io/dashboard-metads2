'use client';

import { PageChrome } from '@/components/page-chrome';
import { Badge, Button, Card, Input, Select, Textarea } from '@/components/ui';
import type { Product } from '@/lib/types';
import { Copy, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const empty = { title: '', slug: '', description: '', destination_url: '', category: '', source_platform: 'shopee', status: 'active' as 'active' | 'inactive' };

export function ProductsView({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error?.message ?? 'Failed to create product');
      return;
    }
    setForm(empty);
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus produk ini? Tindakan ini tidak bisa dibatalkan.')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json.error?.message ?? 'Gagal menghapus');
      return;
    }
    setProducts((current) => current.filter((p) => p.id !== id));
    router.refresh();
  }

  function copyRedirect(slug: string) {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/go/${slug}` : `/go/${slug}`;
    navigator.clipboard?.writeText(url).catch(() => undefined);
  }

  return (
    <PageChrome title="Affiliate Products" subtitle="Manage destination URLs and branded /go redirect links." action={<Button onClick={() => setOpen((v) => !v)}><Plus className="h-4 w-4" />{open ? 'Close form' : 'New product'}</Button>}>
      {open ? (
        <Card className="mb-4 p-5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input placeholder="Slug (optional, auto from title)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="Destination URL (https://shopee.co.id/...)" value={form.destination_url} onChange={(e) => setForm({ ...form, destination_url: e.target.value })} required />
            <Input placeholder="Category (Home, Electronics, ...)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Textarea className="md:col-span-2" placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}><option value="active">active</option><option value="inactive">inactive</option></Select>
            <Select value={form.source_platform} onChange={(e) => setForm({ ...form, source_platform: e.target.value })}><option value="shopee">shopee</option><option value="tokopedia">tokopedia</option><option value="lazada">lazada</option><option value="other">other</option></Select>
            {error ? <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            <div className="md:col-span-2 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</Button></div>
          </form>
        </Card>
      ) : null}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Product', 'Category', 'Redirect URL', 'Clicks', 'Affiliate Clicks', 'Status', ''].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-4"><div className="font-semibold text-slate-900">{product.title}</div><div className="text-xs text-slate-500">{product.description}</div></td>
                <td className="px-5 py-4">{product.category}</td>
                <td className="px-5 py-4"><button type="button" onClick={() => copyRedirect(product.slug)} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 font-semibold text-meta"><Copy className="h-3 w-3" />/go/{product.slug}</button></td>
                <td className="px-5 py-4">{product.totalClicks.toLocaleString()}</td>
                <td className="px-5 py-4">{product.affiliateClicks.toLocaleString()}</td>
                <td className="px-5 py-4"><Badge tone={product.status === 'active' ? 'green' : 'gray'}>{product.status}</Badge></td>
                <td className="px-5 py-4 text-right"><Button variant="danger" onClick={() => handleDelete(product.id)} aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></Button></td>
              </tr>
            ))}
            {products.length === 0 ? <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">Belum ada produk. Klik &quot;New product&quot; untuk menambah.</td></tr> : null}
          </tbody>
        </table>
      </Card>
      <p className="mt-4 text-xs text-slate-500">Need API access? <Link href="/admin/api-keys" className="font-semibold text-meta">Manage API keys</Link>.</p>
    </PageChrome>
  );
}
