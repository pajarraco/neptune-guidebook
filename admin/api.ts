// Thin wrapper around fetch() for the admin REST API.

export type LocaleListItem = {
  lang: string;
  exists: boolean;
  mtime: number | null;
};

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    let detail: string;
    try {
      const body = await res.json();
      detail = body.error || JSON.stringify(body);
    } catch {
      detail = await res.text();
    }
    const err = new Error(`${res.status} ${res.statusText}: ${detail}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  authMe: () => request<{ email: string }>("/api/auth/me"),
  authGoogle: (idToken: string) =>
    request<{ email: string; name?: string; picture?: string }>(
      "/api/auth/google",
      { method: "POST", body: JSON.stringify({ idToken }) },
    ),
  authLogout: () =>
    request<{ ok: true }>("/api/auth/logout", { method: "POST" }),

  listLocales: () =>
    request<{ languages: LocaleListItem[]; dir: string }>("/api/locales"),
  readLocale: (lang: string) =>
    request<Record<string, unknown>>(`/api/locales/${lang}`),
  writeLocale: (lang: string, data: unknown) =>
    request<{ ok: true; lang: string }>(`/api/locales/${lang}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  sheetsPull: () =>
    request<{ ok: true; results: Array<{ lang: string; ok: boolean }> }>(
      "/api/sheets/pull",
      { method: "POST" },
    ),
};
