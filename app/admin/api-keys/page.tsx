import { ApiKeysView } from '@/components/admin/api-keys-view';
import { listApiKeys } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ApiKeysPage() {
  const keys = (await listApiKeys()) as ApiKeysViewProps['initialKeys'];
  return <ApiKeysView initialKeys={keys} />;
}

type ApiKeysViewProps = { initialKeys: { id: string; name: string; key_prefix: string; scopes: string[]; status: string }[] };
