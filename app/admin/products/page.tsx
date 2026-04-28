import { ProductsView } from '@/components/admin/products-view';
import { listProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await listProducts();
  return <ProductsView initialProducts={products} />;
}
