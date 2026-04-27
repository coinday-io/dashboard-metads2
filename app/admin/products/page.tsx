import { PageChrome } from '@/components/page-chrome';
import { Badge, Button, Card } from '@/components/ui';
import { products } from '@/lib/data';
import { Copy, Plus } from 'lucide-react';

export default function ProductsPage() {
  return (
    <PageChrome title="Affiliate Products" subtitle="Manage destination URLs and branded /go redirect links." action={<Button><Plus className="h-4 w-4" />New product</Button>}>
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Product', 'Category', 'Redirect URL', 'Clicks', 'Affiliate Clicks', 'Status'].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={product.id}><td className="px-5 py-4"><div className="font-semibold text-slate-900">{product.title}</div><div className="text-xs text-slate-500">{product.description}</div></td><td className="px-5 py-4">{product.category}</td><td className="px-5 py-4"><button className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 font-semibold text-meta"><Copy className="h-3 w-3" />/go/{product.slug}</button></td><td className="px-5 py-4">{product.totalClicks.toLocaleString()}</td><td className="px-5 py-4">{product.affiliateClicks.toLocaleString()}</td><td className="px-5 py-4"><Badge tone={product.status === 'active' ? 'green' : 'gray'}>{product.status}</Badge></td></tr>)}</tbody></table>
      </Card>
    </PageChrome>
  );
}
