import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './context/AuthContext';
import { useHashRouter } from './lib/useHashRouter';

export const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { view, tab, goToLanding, goToTab, goToDashboard } = useHashRouter();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // When auth resolves: authenticated users always land in the dashboard.
  // If they were on the landing page with a session, push them to /pos (or
  // whichever tab is currently in the URL hash, if it's a dashboard tab).
  useEffect(() => {
    if (isLoading) return;

    if (user && view === 'landing') {
      // Restore their last dashboard tab or default to POS
      goToDashboard(tab === undefined ? 'pos' : tab);
    }
  }, [user, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Loading screen while Supabase restores the session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
            <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-slate-500 text-xs">Restaurando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {view === 'landing' ? (
        <LandingPage
          onOpenAuth={() => setIsAuthOpen(true)}
          onEnterDashboard={() => goToDashboard('pos')}
        />
      ) : (
        <DashboardLayout
          activeTab={tab}
          onTabChange={goToTab}
          onBackToLanding={goToLanding}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          goToDashboard('pos');
        }}
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
