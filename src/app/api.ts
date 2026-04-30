// Thin wrapper around fetch() for the guest app API.

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const accessCode = import.meta.env.VITE_CODE || "";
  const url = new URL(path, window.location.origin);
  if (accessCode) {
    url.searchParams.set("code", accessCode);
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
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
  readConfig: () =>
    request<{ amenityIcons?: string[] }>("/settings/config.json"),
};
