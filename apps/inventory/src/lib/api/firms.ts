import type { Firm } from "@/src/types/firm";

const BASE = "";

async function request<T>(
  path: string,
  options?: RequestInit & { parseJson?: boolean }
): Promise<{ data?: T; error?: string; status: number }> {
  const { parseJson = true, ...init } = options ?? {};
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    const body = parseJson ? await res.json().catch(() => ({})) : undefined;
    if (!res.ok) {
      return {
        status: res.status,
        error: (body as { error?: string })?.error ?? res.statusText,
        data: (body as { data?: T })?.data,
      };
    }
    return { status: res.status, data: (body as { data?: T })?.data };
  } catch (e) {
    return {
      status: 500,
      error: e instanceof Error ? e.message : "Request failed",
    };
  }
}

export async function fetchFirms(): Promise<{ data: Firm[]; error?: string }> {
  const out = await request<Firm[]>("/api/firms");
  if (out.error || out.status !== 200) {
    return { data: [], error: out.error };
  }
  return { data: Array.isArray(out.data) ? out.data : [] };
}

export async function fetchFirm(id: string): Promise<{ data: Firm | null; error?: string }> {
  const out = await request<Firm>(`/api/firms/${id}`);
  if (out.error || out.status !== 200) {
    return { data: null, error: out.error };
  }
  return { data: out.data ?? null };
}

export async function createFirm(
  payload: Omit<Firm, "id" | "createdAt" | "updatedAt">
): Promise<{ data: Firm | null; error?: string }> {
  const out = await request<Firm>("/api/firms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (out.error || (out.status !== 200 && out.status !== 201)) {
    return { data: null, error: out.error };
  }
  return { data: out.data ?? null };
}

export async function updateFirm(
  id: string,
  payload: Partial<Firm>
): Promise<{ data: Firm | null; error?: string }> {
  const out = await request<Firm>(`/api/firms/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (out.error || out.status !== 200) {
    return { data: null, error: out.error };
  }
  return { data: out.data ?? null };
}

export async function deleteFirm(id: string): Promise<{ error?: string }> {
  const out = await request<unknown>(`/api/firms/${id}`, { method: "DELETE" });
  if (out.error || (out.status !== 200 && out.status !== 204)) {
    return { error: out.error };
  }
  return {};
}
