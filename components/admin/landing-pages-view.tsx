'use client';

import { PageChrome } from '@/components/page-chrome';
import { Badge, Button, Card, Input, Select, Textarea } from '@/components/ui';
import type { LandingPage, Product } from '@/lib/types';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const empty = { title: '', slug: '', intro: '', disclosure_text: 'Beberapa link di halaman ini adalah link affiliate.', status: 'draft' as 'draft' | 'published' | 'archived', product_ids: [] as string[] };

export function LandingPagesView({ initialPages, products }: { initialPages: LandingPage[]; products: Product[] }) {
  const router = useRouter();
  const [pages, setPages] = useState(initialPages);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleProduct(id: string) {
    setForm((current) => ({ ...current, product_ids: current.product_ids.includes(id) ? current.product_ids.filter((p) => p !== id) : [...current.product_ids, id] }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch('/api/landing-pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error?.message ?? 'Failed to create landing page');
      return;
    }
    setForm(empty);
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus landing page ini?')) return;
    const res = await fetch(`/api/landing-pages/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json.error?.message ?? 'Gagal menghapus');
      return;
    }
    setPages((current) => current.filter((p) => p.id !== id));
    router.refresh();
  }

  async function handlePublishToggle(page: LandingPage) {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/landing-pages/${page.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json.error?.message ?? 'Gagal mengubah status');
      return;
    }
    setPages((current) => current.map((p) => (p.id === page.id ? { ...p, status: newStatus } : p)));
    router.refresh();
  }

  return (
    <PageChrome title="Landing Pages" subtitle="Create curated affiliate landing pages and monitor button CTR." action={<Button onClick={() => setOpen((v) => !v)}><Plus className="h-4 w-4" />{open ? 'Close form' : 'New landing page'}</Button>}>
      {open ? (
        <Card className="mb-4 p-5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input placeholder="Title (e.g. Rekomendasi Produk Viral)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input placeholder="Slug (optional, auto from title)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Textarea className="md:col-span-2" placeholder="Intro / hero copy" value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} />
            <Textarea className="md:col-span-2" placeholder="Affiliate disclosure" value={form.disclosure_text} onChange={(e) => setForm({ ...form, disclosure_text: e.target.value })} />
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' | 'archived' })}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></Select>
            <div className="md:col-span-2">
              <p className="mb-2 text-xs font-semibold text-slate-600">Products on this page</p>
              <div className="flex flex-wrap gap-2">
                {products.map((product) => <button type="button" key={product.id} onClick={() => toggleProduct(product.id)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${form.product_ids.includes(product.id) ? 'border-meta bg-blue-50 text-meta' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{product.title}</button>)}
                {products.length === 0 ? <p className="text-xs text-slate-500">Tambahkan produk dulu di /admin/products.</p> : null}
              </div>
            </div>
            {error ? <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            <div className="md:col-span-2 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save landing page'}</Button></div>
          </form>
        </Card>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.id} className="p-5">
            <div className="mb-4 flex items-start justify-between">
              <div><h2 className="font-bold">{page.title}</h2><p className="mt-1 text-sm text-slate-500">/rekomendasi/{page.slug}</p></div>
              <Badge tone={page.status === 'published' ? 'green' : page.status === 'draft' ? 'amber' : 'gray'}>{page.status}</Badge>
            </div>
            <p className="min-h-12 text-sm text-slate-600">{page.intro}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-lg bg-slate-50 p-3"><b>{page.views.toLocaleString()}</b><span className="block text-xs text-slate-500">Views</span></div>
              <div className="rounded-lg bg-slate-50 p-3"><b>{page.buttonClicks.toLocaleString()}</b><span className="block text-xs text-slate-500">Clicks</span></div>
              <div className="rounded-lg bg-slate-50 p-3"><b>{page.ctr}%</b><span className="block text-xs text-slate-500">CTR</span></div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <a href={`/rekomendasi/${page.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-meta">Preview <ExternalLink className="h-4 w-4" /></a>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handlePublishToggle(page)}>{page.status === 'published' ? 'Unpublish' : 'Publish'}</Button>
                <Button variant="danger" onClick={() => handleDelete(page.id)} aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
        {pages.length === 0 ? <p className="text-sm text-slate-500">Belum ada landing page. Klik &quot;New landing page&quot; untuk membuat.</p> : null}
      </div>
    </PageChrome>
  );
}
