import { PageChrome } from '@/components/page-chrome';
import { Badge, Button, Card, Input } from '@/components/ui';
import { KeyRound, Plus } from 'lucide-react';

const keys = [{ name: 'Hermes Agent Production Key', prefix: 'aff_live_a7f4', scopes: ['products:read', 'landing_pages:write', 'reports:read'], status: 'active' }, { name: 'Ad Spend Importer', prefix: 'aff_live_b92c', scopes: ['ad_spend:write', 'reports:read'], status: 'active' }];

export default function ApiKeysPage() {
  return <PageChrome title="API Keys" subtitle="Create scoped keys for trusted agents and automation." action={<Button><Plus className="h-4 w-4" />Create key</Button>}><Card className="mb-4 grid gap-3 p-4 md:grid-cols-3"><Input placeholder="Key name" /><Input value="products:read,reports:read" /><Button><KeyRound className="h-4 w-4" />Generate once</Button></Card><Card className="overflow-hidden"><table className="w-full text-left text-sm"><tbody className="divide-y divide-slate-100">{keys.map((key) => <tr key={key.prefix}><td className="px-5 py-4 font-semibold">{key.name}</td><td className="px-5 py-4 font-mono text-meta">{key.prefix}••••</td><td className="px-5 py-4">{key.scopes.join(', ')}</td><td className="px-5 py-4"><Badge>{key.status}</Badge></td></tr>)}</tbody></table></Card></PageChrome>;
}
