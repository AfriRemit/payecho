export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000';
}

/**
 * POST JSON to the backend. For protected routes, pass token from useAuth().getToken() in opts.
 * Sends Privy identity token as Bearer and privy-id-token header.
 */
export async function apiPostJson<TResponse>(
  path: string,
  body: unknown,
  opts?: { token?: string | null },
): Promise<TResponse> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.token
        ? {
            Authorization: `Bearer ${opts.token}`,
            'privy-id-token': opts.token,
          }
        : {}),
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as TResponse;
  return data;
}

/**
 * GET from the backend. For protected routes, pass token from useAuth().getToken() in opts.
 * Throws if response is not ok (e.g. 401).
 */
export async function apiGetJson<TResponse>(
  path: string,
  opts?: { token?: string | null },
): Promise<TResponse> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'GET',
    headers: {
      ...(opts?.token
        ? {
            Authorization: `Bearer ${opts.token}`,
            'privy-id-token': opts.token,
          }
        : {}),
    },
  });

  const data = (await res.json().catch(() => ({}))) as TResponse;
  if (!res.ok) throw new Error((data as { message?: string })?.message || `Request failed: ${res.status}`);
  return data;
}

/**
 * PATCH JSON to the backend. For protected routes, pass token from useAuth().getToken() in opts.
 * Throws if response is not ok (e.g. 401).
 */
export async function apiPatchJson<TResponse>(
  path: string,
  body: unknown,
  opts?: { token?: string | null },
): Promise<TResponse> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.token
        ? {
            Authorization: `Bearer ${opts.token}`,
            'privy-id-token': opts.token,
          }
        : {}),
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as TResponse & { message?: string };
  if (!res.ok) throw new Error(data?.message ?? `Request failed: ${res.status}`);
  return data as TResponse;
}

