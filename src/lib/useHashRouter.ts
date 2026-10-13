/**
 * useHashRouter – simple hash-based router for LUBRIX SaaS
 *
 * URL map:
 *   /#/          → landing
 *   /#/pos       → POS / Cobro
 *   /#/vehicles  → Buscador de Aceites
 *   /#/inventory → Inventario & Tambores
 *   /#/crm       → CRM WhatsApp
 *   /#/reports   → Reportes & Comisiones
 *   /#/manual    → Manual de Usuario
 */

import { useState, useEffect, useCallback } from 'react';

export type DashboardTab = 'pos' | 'vehicles' | 'inventory' | 'crm' | 'reports' | 'settings' | 'manual';
export type AppView = 'landing' | 'dashboard';

const DASHBOARD_TABS: DashboardTab[] = [
  'pos',
  'vehicles',
  'inventory',
  'crm',
  'reports',
  'settings',
  'manual',
];

function getHash(): string {
  // Normalize: remove leading #, then leading /
  return window.location.hash.replace(/^#\/?/, '') || '';
}

function parseHash(raw: string): { view: AppView; tab: DashboardTab } {
  const segment = raw.split('/')[0] as DashboardTab;
  if (DASHBOARD_TABS.includes(segment)) {
    return { view: 'dashboard', tab: segment };
  }
  // Empty or 'landing' → landing page
  if (raw === '' || raw === 'landing') {
    return { view: 'landing', tab: 'pos' };
  }
  // Unknown hash → fallback to POS dashboard
  return { view: 'dashboard', tab: 'pos' };
}

export function useHashRouter() {
  const initial = parseHash(getHash());
  const [view, setView] = useState<AppView>(initial.view);
  const [tab, setTabState] = useState<DashboardTab>(initial.tab);

  // Push a new hash without causing a full navigation
  const pushHash = useCallback((hash: string) => {
    window.location.hash = '/' + hash;
  }, []);

  // Navigate to the landing page
  const goToLanding = useCallback(() => {
    pushHash('landing');
  }, [pushHash]);

  // Navigate to a dashboard tab
  const goToTab = useCallback(
    (nextTab: DashboardTab) => {
      pushHash(nextTab);
    },
    [pushHash]
  );

  // Navigate to dashboard (defaults to last tab or 'pos')
  const goToDashboard = useCallback(
    (nextTab: DashboardTab = 'pos') => {
      pushHash(nextTab);
    },
    [pushHash]
  );

  // Sync state whenever the hash changes (back/forward, manual edits, pushHash calls)
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash(getHash());
      setView(parsed.view);
      setTabState(parsed.tab);
    };

    window.addEventListener('hashchange', onHashChange);

    // Also set the initial hash if the page loaded without one
    if (!window.location.hash) {
      // Don't push; just let the state sit at landing
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return { view, tab, goToLanding, goToTab, goToDashboard };
}
