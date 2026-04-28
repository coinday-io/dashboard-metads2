import { AdSpendView } from '@/components/admin/ad-spend-view';
import { listAdSpend } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdSpendPage() {
  const reports = await listAdSpend();
  return <AdSpendView initialRows={reports} />;
}
