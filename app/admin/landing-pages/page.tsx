import { LandingPagesView } from '@/components/admin/landing-pages-view';
import { listLandingPages, listProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function LandingPagesAdmin() {
  const [landingPages, products] = await Promise.all([listLandingPages(), listProducts()]);
  return <LandingPagesView initialPages={landingPages} products={products} />;
}
