import { Card } from '@/components/ui';
import { Suspense } from 'react';
import { LoginForm } from './login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy to-slate-800 p-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-meta text-3xl text-white">∞</div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-slate-500">Private affiliate dashboard access</p>
        </div>
        <Suspense fallback={<p className="text-center text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </Card>
    </main>
  );
}
