import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { roleHomes } from '../data/portalData';
import authService from '../services/authService';

const AUTH_KEY = 'sis-auth-session';
const SESSION_DURATION = 8 * 60 * 60 * 1000;

const AuthContext = createContext(null);

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const readSession = () => {
  const sources = [window.localStorage.getItem(AUTH_KEY), window.sessionStorage.getItem(AUTH_KEY)];
  for (const raw of sources) {
    if (!raw) continue;
    const session = safeParse(raw);
    if (!session?.user) continue;
    if (session.expiresAt && Date.now() > session.expiresAt) {
      continue;
    }
    return session;
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => (typeof window === 'undefined' ? null : readSession()));

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(AUTH_KEY);
    setSession(null);
  }, []);

  useEffect(() => {
    if (!session) return;

    const remaining = Math.max(session.expiresAt - Date.now(), 0);
    const timer = window.setTimeout(() => {
      logout();
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [session, logout]);

  const persistSession = useCallback((nextSession, rememberMe) => {
    window.localStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(AUTH_KEY);

    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  const login = useCallback(async ({ username, password, rememberMe }) => {
    const user = await authService.login({ username, password });

    const nextSession = {
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      },
      expiresAt: Date.now() + SESSION_DURATION,
    };

    persistSession(nextSession, rememberMe);
    return nextSession.user;
  }, [persistSession]);

  const value = useMemo(
    () => ({
      currentUser: session?.user || null,
      expiresAt: session?.expiresAt || null,
      login,
      logout,
    }),
    [login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const getRoleHome = (role) => roleHomes[role] || '/login';
