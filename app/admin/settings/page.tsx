import { SettingsView } from '@/components/admin/settings-view';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsView initial={settings} />;
}
