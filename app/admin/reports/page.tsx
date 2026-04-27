import { PageChrome } from '@/components/page-chrome';
import { PerformanceChart } from '@/components/charts';
import { Card, Select } from '@/components/ui';
import { campaignReports, dashboardMetrics, products } from '@/lib/data';
import { currency } from '@/lib/format';

export default function ReportsPage() {
  return (
    <PageChrome title="Performance Reports" subtitle="Compare Meta clicks, redirect clicks, affiliate clicks, CPC, and ROAS." action={<Select><option>Group by campaign</option><option>Group by product</option></Select>}>
      <div className="grid gap-4 md:grid-cols-4"><Card className="p-5"><p className="text-sm text-slate-500">Cost / Redirect Click</p><b className="text-3xl">{currency(0.36)}</b></Card><Card className="p-5"><p className="text-sm text-slate-500">Cost / Affiliate Click</p><b className="text-3xl">{currency(0.42)}</b></Card><Card className="p-5"><p className="text-sm text-slate-500">Duplicate Rate</p><b className="text-3xl">{dashboardMetrics.duplicateRate}%</b></Card><Card className="p-5"><p className="text-sm text-slate-500">Bot Rate</p><b className="text-3xl">{dashboardMetrics.botRate}%</b></Card></div>
      <Card className="mt-4 p-5"><h2 className="mb-4 font-bold">Click Trend</h2><PerformanceChart /></Card>
      <div className="mt-4 grid gap-4 xl:grid-cols-2"><Card className="overflow-hidden"><div className="p-4 font-bold">Campaign Economics</div><table className="w-full text-left text-sm"><tbody className="divide-y divide-slate-100">{campaignReports.map((row) => <tr key={row.name}><td className="px-4 py-3 font-semibold text-meta">{row.name}</td><td className="px-4 py-3">CPRC {currency(row.costPerRedirectClick)}</td><td className="px-4 py-3">ROAS {row.roas}</td></tr>)}</tbody></table></Card><Card className="overflow-hidden"><div className="p-4 font-bold">Top Products</div><table className="w-full text-left text-sm"><tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={product.id}><td className="px-4 py-3 font-semibold text-meta">{product.title}</td><td className="px-4 py-3">{product.totalClicks.toLocaleString()} clicks</td><td className="px-4 py-3">{product.conversionRate}% CVR</td></tr>)}</tbody></table></Card></div>
    </PageChrome>
  );
}
