import { NextResponse } from 'next/server';

export function ok<T>(data: T, meta?: Record<string, number | string>) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function apiError(code: string, message: string, status = 400, details: unknown[] = []) {
  return NextResponse.json({ success: false, error: { code, message, details } }, { status });
}

export function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), meta: { page, pageSize, total: items.length } };
}

export async function readJson(request: Request): Promise<{ ok: true; data: unknown } | { ok: false; response: ReturnType<typeof apiError> }> {
  try {
    return { ok: true, data: await request.json() };
  } catch {
    return { ok: false, response: apiError('INVALID_JSON', 'Request body must be valid JSON', 400) };
  }
}
