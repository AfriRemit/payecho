export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001';
}

export async function apiPostJson<TResponse>(
  path: string,
  body: unknown,
  opts?: { token?: string },
): Promise<TResponse> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as TResponse;
  return data;
}

