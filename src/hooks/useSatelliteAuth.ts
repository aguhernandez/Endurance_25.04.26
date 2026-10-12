import { useState, useEffect } from 'react';

const HUB_FRONTEND_URL = import.meta.env.VITE_HUB_FRONTEND_URL || 'https://hub.asciende.pro';
const HUB_API_URL = import.meta.env.VITE_HUB_API_URL || 'https://ngkcbygyiibqhlmlnuvl.supabase.co';
const SESSION_TOKEN_KEY = 'hub_session_token';

export type MembershipSlug = 'inicia' | 'intermediate' | 'pro';

export interface HubUser {
  id: string;
  email: string;
  name?: string;
  role: 'athlete' | 'trainer' | 'admin';
  active_plan?: string[];
  membership_slug: MembershipSlug;
  membership_name: string;
  assigned_athletes?: string[];
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(payload: Record<string, unknown>): boolean {
  if (typeof payload.exp !== 'number') return false;
  return Date.now() / 1000 > payload.exp;
}

function extractUserFromPayload(payload: Record<string, unknown>): HubUser | null {
  const sub = payload.sub ?? payload.user_id ?? payload.id;
  const email = payload.email;
  if (!sub || !email) return null;
  return {
    id: String(sub),
    email: String(email),
    name: payload.name ? String(payload.name) : undefined,
    role: (payload.role as HubUser['role']) ?? 'athlete',
    active_plan: Array.isArray(payload.active_plan) ? payload.active_plan : undefined,
    membership_slug: (payload.membership_slug as MembershipSlug) ?? 'inicia',
    membership_name: payload.membership_name ? String(payload.membership_name) : 'Asciende Inicia',
    assigned_athletes: Array.isArray(payload.assigned_athletes) ? payload.assigned_athletes as string[] : undefined,
  };
}

export function useSatelliteAuth() {
  const [user, setUser] = useState<HubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('session_token');

    if (tokenFromUrl) {
      console.log('[Auth] session_token found in URL, storing...');
      localStorage.setItem(SESSION_TOKEN_KEY, tokenFromUrl);
      urlParams.delete('session_token');
      const remaining = urlParams.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${remaining ? `?${remaining}` : ''}${window.location.hash}`);
    }

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);

      if (!token) {
        console.log('[Auth] No session token found');
        setUser(null);
        return;
      }

      console.log('[Auth] Decoding session token...');
      const payload = decodeJwtPayload(token);

      if (!payload) {
        console.log('[Auth] Invalid JWT format');
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setUser(null);
        return;
      }

      if (isTokenExpired(payload)) {
        console.log('[Auth] Token expired');
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setUser(null);
        return;
      }

      console.log('[Auth] JWT payload:', payload);
      const hubUser = extractUserFromPayload(payload);

      if (hubUser) {
        console.log('[Auth] User authenticated from token:', hubUser.email);
        setUser(hubUser);
      } else {
        console.log('[Auth] Could not extract user from token payload');
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setUser(null);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      console.error('[Auth] Check failed:', errorMsg);
      setAuthError(errorMsg);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${HUB_API_URL}/functions/v1/academy-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let message = 'Authentication failed';
      try {
        const body = await res.json();
        message = body.error || body.message || message;
      } catch {}
      throw new Error(message);
    }

    const data = await res.json();
    const token: string = data.token || data.session_token || data.access_token;
    if (!token) throw new Error('No token received from Hub');

    localStorage.setItem(SESSION_TOKEN_KEY, token);

    const payload = decodeJwtPayload(token);
    if (!payload || isTokenExpired(payload)) {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      throw new Error('Received invalid or expired token');
    }

    const hubUser = extractUserFromPayload(payload);
    if (!hubUser) {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      throw new Error('Could not extract user from token');
    }

    setUser(hubUser);
  };

  const login = () => {
    const currentUrl = window.location.href;
    const hubAuthUrl = `${HUB_FRONTEND_URL}?redirect=${encodeURIComponent(currentUrl)}`;
    window.location.href = hubAuthUrl;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setUser(null);
  };

  const hasToken = user !== null;

  return { user, loading, hasToken, authError, login, logout, loginWithCredentials };
}
