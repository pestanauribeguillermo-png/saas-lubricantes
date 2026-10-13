import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { POSView } from './POSView';
import { VehicleCatalogView } from './VehicleCatalogView';
import { InventoryView } from './InventoryView';
import { CrmView } from './CrmView';
import { ReportsView } from './ReportsView';
import { SettingsView } from './SettingsView';
import { UserManualView } from './UserManualView';
import { DEFAULT_ORG_ID } from '../../lib/supabase';
import { VehicleCatalog } from '../../types/database';
import { DashboardTab } from '../../lib/useHashRouter';
import {
  ShoppingCart,
  Car,
  Package,
  MessageSquare,
  BarChart3,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
  Building2,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';

interface DashboardLayoutProps {
  /** Currently active module tab — driven by URL hash */
  activeTab: DashboardTab;
  /** Called when the user navigates to a different tab; updates the URL */
  onTabChange: (tab: DashboardTab) => void;
  onBackToLanding: () => void;
}

const navigationItems: { id: DashboardTab; label: string; icon: any; badge: string | null }[] = [
  { id: 'pos', label: 'POS / Cobro', icon: ShoppingCart, badge: null },
  { id: 'vehicles', label: 'Buscador Aceites', icon: Car, badge: 'OEM' },
  { id: 'inventory', label: 'Inventario & Tambores', icon: Package, badge: null },
  { id: 'crm', label: 'CRM WhatsApp', icon: MessageSquare, badge: 'Auto' },
  { id: 'reports', label: 'Reportes & Comisiones', icon: BarChart3, badge: null },
  { id: 'settings', label: 'Ajustes Taller', icon: SettingsIcon, badge: 'Nuevo' },
  { id: 'manual', label: 'Manual de Usuario', icon: BookOpen, badge: 'Guía' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onTabChange,
  onBackToLanding,
}) => {
  const { organization, profile, user, currentRole, switchDemoRole, logout, isDemoMode } =
    useAuth();

  const orgId = organization?.id || DEFAULT_ORG_ID;

  const [preloadedVehicle, setPreloadedVehicle] = useState<VehicleCatalog | null>(null);

  const handleSelectVehicleForPOS = (vehicle: VehicleCatalog) => {
    setPreloadedVehicle(vehicle);
    onTabChange('pos');
  };

  const handleLogout = async () => {
    await logout();
    onBackToLanding();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col antialiased">
      {/* ── TOP HEADER ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Logo & Org Name */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={onBackToLanding}
            title="Ir a la página principal"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base tracking-wider font-['Outfit']">
                  LUBRIX
                </span>
                <span className="text-[10px] font-bold px-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span className="truncate max-w-[140px] sm:max-w-[220px]">
                  {organization?.name || 'LubriExpress Pro'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Center Desktop Navigation ────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={item.label}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 ${isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[9px] px-1 rounded bg-slate-800 text-amber-400 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Right Controls ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Role Switcher — only visible in demo mode */}
          {isDemoMode && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 text-[11px]">
              <span className="text-[10px] text-slate-400 px-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Modo Demo:
              </span>
              {(['admin', 'mechanic', 'cashier'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => switchDemoRole(role)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${currentRole === role
                    ? role === 'admin'
                      ? 'bg-amber-500 text-black'
                      : role === 'mechanic'
                        ? 'bg-blue-500 text-white'
                        : 'bg-emerald-500 text-black'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {role === 'admin' ? 'Admin' : role === 'mechanic' ? 'Mecánico' : 'Cajera'}
                </button>
              ))}
            </div>
          )}

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile?.full_name || 'Usuario'}
                className="w-8 h-8 rounded-full border border-amber-500/40 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-black font-black text-xs flex items-center justify-center border border-amber-500/60 shadow-md">
                {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">
                {profile?.full_name || user?.email?.split('@')[0] || 'Usuario'}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold capitalize">
                {profile?.role === 'admin'
                  ? '👑 Administrador'
                  : profile?.role === 'mechanic'
                    ? '🔧 Mecánico'
                    : '💳 Cajera'}
              </span>
            </div>
          </div>

          {/* Landing button */}
          <button
            onClick={onBackToLanding}
            title="Volver a la Landing Comercial"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
          >
            <Globe className="w-4 h-4 text-slate-400" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'pos' && <POSView preloadedVehicleInfo={preloadedVehicle} />}
        {activeTab === 'vehicles' && (
          <VehicleCatalogView onSelectForPOS={handleSelectVehicleForPOS} />
        )}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'crm' && <CrmView />}
        {activeTab === 'reports' && <ReportsView key={orgId} />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'manual' && (
          <UserManualView onNavigateToTab={(t) => onTabChange(t as DashboardTab)} />
        )}
      </main>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-500/20' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
