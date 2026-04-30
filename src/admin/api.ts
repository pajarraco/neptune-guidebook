// Thin wrapper around fetch() for the admin REST API.

export type LocaleListItem = {
  lang: string;
  exists: boolean;
  mtime: number | null;
};

export type SettingListItem = {
  setting: string;
  exists: boolean;
  mtime: number | null;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });
  const text = await res.text();
  if (!res.ok) {
    let detail: string;
    try {
      const body = JSON.parse(text);
      detail = body.error || JSON.stringify(body);
    } catch {
      detail = text;
    }
    const err = new Error(`${res.status} ${res.statusText}: ${detail}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  if (res.status === 204 || !text) return undefined as T;
  return JSON.parse(text);
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
  sheetsPush: () =>
    request<{ ok: true; results: Array<{ lang: string; ok: boolean }> }>(
      "/api/sheets/push",
      { method: "POST" },
    ),

  listSettings: () =>
    request<{ settings: SettingListItem[]; dir: string }>("/api/settings"),
  readSetting: (setting: string) =>
    request<Record<string, unknown>>(`/api/settings/${setting}`),
  writeSetting: (setting: string, data: unknown) =>
    request<{ ok: true; setting: string }>(`/api/settings/${setting}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
