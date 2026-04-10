/**
 * DemoModeContext — Read-only demo experience provider for Refugium.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';

const DEMO_STORAGE_KEY = 'refugium_demo_session';

export interface DemoSession {
  name: string;
  email: string;
  organization: string;
  grantedAt: string;
}

interface DemoModeContextValue {
  isDemoMode: boolean;
  demoSession: DemoSession | null;
  startDemo: (session: DemoSession) => void;
  endDemo: () => void;
  simulateWrite: (actionLabel?: string) => boolean;
}

const DemoModeCtx = createContext<DemoModeContextValue | undefined>(undefined);

function loadSession(): DemoSession | null {
  try {
    const raw = sessionStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: DemoSession | null) {
  try {
    if (session) {
      sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
    }
  } catch { /* ignore */ }
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(loadSession);

  const startDemo = useCallback((s: DemoSession) => {
    setSession(s);
    saveSession(s);
  }, []);

  const endDemo = useCallback(() => {
    setSession(null);
    saveSession(null);
  }, []);

  const simulateWrite = useCallback((actionLabel?: string) => {
    toast.success(actionLabel || 'Changes saved', {
      description: 'Demo mode — no data was written',
      duration: 2000,
    });
    return true;
  }, []);

  return (
    <DemoModeCtx.Provider value={{
      isDemoMode: !!session,
      demoSession: session,
      startDemo,
      endDemo,
      simulateWrite,
    }}>
      {children}
    </DemoModeCtx.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoModeCtx);
  if (!ctx) throw new Error('useDemoMode must be used within DemoModeProvider');
  return ctx;
}
