type StrapiRecord<T> = {
  id?: number | string;
  attributes?: Record<string, unknown> & T;
} & Partial<T>;

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "";

export function isStrapiConfigured(): boolean {
  return Boolean(baseUrl);
}

export async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  if (!baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getCollectionEntries<T>(payload: unknown): Array<StrapiRecord<T>> {
  if (Array.isArray(payload)) {
    return payload as Array<StrapiRecord<T>>;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown[] }).data)
  ) {
    return (payload as { data: Array<StrapiRecord<T>> }).data;
  }

  return [];
}

export function getScalar(payload: unknown, key: string, fallback = ""): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

export function getNumber(payload: unknown, key: string, fallback = 0): number {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "number" ? value : fallback;
}

export function flattenEntry<T extends Record<string, unknown>>(entry: StrapiRecord<T>): Record<string, unknown> {
  if (entry?.attributes && typeof entry.attributes === "object") {
    return {
      id: entry.id,
      ...entry.attributes,
    };
  }

  return entry as Record<string, unknown>;
}
