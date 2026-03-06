const KEY = 'payecho_postLoginRedirect';

export function getPostLoginRedirect(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setPostLoginRedirect(path: string): void {
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // ignore
  }
}

export function clearPostLoginRedirect(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
