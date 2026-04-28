import { Button, Card } from '@/components/ui';
import { getLandingPageBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PublicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getLandingPageBySlug(slug);
  if (!result) notFound();
  const { page, products: pageProducts } = result;
  if (page.status !== 'published') notFound();
  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-navy to-slate-800 p-8 text-white shadow-soft md:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">Affiliate Picks</p>
          <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">{page.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-200">{page.intro}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pageProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100"><span className="text-6xl">∞</span></div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-meta">{product.category}</p>
                <h2 className="mt-2 text-xl font-bold">{product.title}</h2>
                <p className="mt-2 min-h-16 text-sm text-slate-600">{product.description}</p>
                <a href={`/go/${product.slug}?utm_source=landing&utm_medium=affiliate&utm_campaign=${page.slug}&lp=${page.slug}`}>
                  <Button className="mt-5 w-full">Cek di Shopee</Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{page.disclosureText}</p>
      </section>
    </main>
  );
}
