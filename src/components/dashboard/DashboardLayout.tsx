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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  User,
} from 'lucide-react';

interface DashboardLayoutProps {
  /** Currently active module tab — driven by URL hash */
  activeTab: DashboardTab;
  /** Called when the user navigates to a different tab; updates the URL */
  onTabChange: (tab: DashboardTab) => void;
  onBackToLanding: () => void;
}

const navigationItems: {
  id: DashboardTab;
  label: string;
  icon: any;
  badge: string | null;
  badgeColor?: string;
  category?: 'operativo' | 'gestion';
}[] = [
  { id: 'pos', label: 'POS / Cobro', icon: ShoppingCart, badge: null, category: 'operativo' },
  { id: 'vehicles', label: 'Buscador Aceites', icon: Car, badge: 'OEM', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', category: 'operativo' },
  { id: 'inventory', label: 'Inventario & Tambores', icon: Package, badge: null, category: 'operativo' },
  { id: 'crm', label: 'CRM WhatsApp', icon: MessageSquare, badge: 'Auto', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', category: 'gestion' },
  { id: 'reports', label: 'Reportes & Finanzas', icon: BarChart3, badge: null, category: 'gestion' },
  { id: 'settings', label: 'Ajustes del Taller', icon: SettingsIcon, badge: 'Nuevo', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30', category: 'gestion' },
  { id: 'manual', label: 'Manual de Usuario', icon: BookOpen, badge: 'Guía', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30', category: 'gestion' },
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectVehicleForPOS = (vehicle: VehicleCatalog) => {
    setPreloadedVehicle(vehicle);
    onTabChange('pos');
  };

  const handleLogout = async () => {
    await logout();
    onBackToLanding();
  };

  const currentTabLabel = navigationItems.find((n) => n.id === activeTab)?.label || 'Panel de Control';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex antialiased">
      {/* ── DESKTOP SIDEBAR (Visible lg and up) ───────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-50 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand / Logo Area */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div
            className={`flex items-center gap-2.5 cursor-pointer overflow-hidden transition-all ${
              isSidebarCollapsed ? 'justify-center w-full' : ''
            }`}
            onClick={onBackToLanding}
            title="Ir a la página principal"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Zap className="w-5 h-5 text-black font-black" />
            </div>

            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-base tracking-wider font-['Outfit']">
                    LUBRIX
                  </span>
                  <span className="text-[10px] font-bold px-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate max-w-[130px]">
                    {organization?.name || 'LubriExpress'}
                  </span>
                </p>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              title="Colapsar menú lateral"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand toggle button */}
        {isSidebarCollapsed && (
          <div className="p-2 border-b border-slate-800/80 flex justify-center">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              title="Expandir menú lateral"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Organization Mini Badge */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Establecimiento Activo
            </div>
            <div className="text-xs font-semibold text-white truncate mt-0.5">
              {organization?.name || 'Lubricadora'}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{organization?.currency || 'USD'} • Sistema En Línea</span>
            </div>
          </div>
        )}

        {/* Navigation Modules list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {!isSidebarCollapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Módulos Principales
            </div>
          )}

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isSidebarCollapsed
                    ? 'justify-center p-3'
                    : 'px-3.5 py-2.5 gap-3'
                } ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isSidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  } ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'}`}
                />

                {!isSidebarCollapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md border font-semibold ${
                          isActive
                            ? 'bg-black/20 text-slate-950 border-black/30'
                            : item.badgeColor || 'bg-slate-800 text-amber-400 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip on hover when collapsed */}
                {isSidebarCollapsed && (
                  <div className="hidden group-hover:flex absolute left-full ml-2 px-2.5 py-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg whitespace-nowrap shadow-xl z-50 pointer-events-none items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] text-amber-400">({item.badge})</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
          <div
            className={`flex items-center gap-2.5 ${
              isSidebarCollapsed ? 'justify-center' : 'px-1'
            }`}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile?.full_name || 'Usuario'}
                className="w-8 h-8 rounded-full border border-amber-500/40 object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-black font-black text-xs flex items-center justify-center border border-amber-500/60 shadow-md shrink-0">
                {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <span className="text-xs font-bold text-white block truncate leading-tight">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold block capitalize truncate">
                  {profile?.role === 'admin'
                    ? '👑 Administrador'
                    : profile?.role === 'mechanic'
                    ? '🔧 Mecánico'
                    : '💳 Cajera'}
                </span>
              </div>
            )}

            {!isSidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE AREA ───────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* ── TOP HEADER (Barra superior) ─────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Mobile menu trigger & Current Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                  {currentTabLabel}
                </h1>
                <span className="hidden sm:inline-block text-[11px] text-slate-400">
                  • {organization?.name || 'Lubricadora'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Role Switcher — only visible in demo mode */}
            {isDemoMode && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 text-[11px]">
                <span className="text-[10px] text-slate-400 px-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Demo:
                </span>
                {(['admin', 'mechanic', 'cashier'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => switchDemoRole(role)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                      currentRole === role
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

            {/* Landing button */}
            <button
              onClick={onBackToLanding}
              title="Volver a la Landing Comercial"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Landing</span>
            </button>

            {/* Logout button (Header fallback for mobile / quick access) */}
            <button
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile slide-out drawer (if mobile burger opened) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-72 max-w-[85%] h-full bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-base">LUBRIX PRO</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-amber-500 text-black font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}

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
      </div>

      {/* ── MOBILE BOTTOM NAV (Solo visible en pantallas pequeñas) ──── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-500/20' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-[54px]">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
