'use client';

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { getPostLoginRedirect, clearPostLoginRedirect } from '../../lib/postLoginRedirect.ts';

/**
 * When user becomes authenticated, redirect to path stored by setPostLoginRedirect (e.g. /register).
 * Mount once inside Router + AuthProvider.
 */
export function PostLoginRedirect() {
  const navigate = useNavigate();
  const { isAuthenticated, ready } = useAuth();
  const prevAuthenticated = useRef(false);

  useEffect(() => {
    if (!ready || !isAuthenticated) return;
    if (prevAuthenticated.current) return;
    prevAuthenticated.current = true;
    const path = getPostLoginRedirect();
    if (path) {
      clearPostLoginRedirect();
      navigate(path, { replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) prevAuthenticated.current = false;
  }, [isAuthenticated]);

  return null;
}
