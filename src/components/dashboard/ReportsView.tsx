import React, { useState, useEffect, useRef } from 'react';
import { supabase, DEFAULT_ORG_ID } from '../../lib/supabase';
import { Sale, Profile } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/currency';
import {
  TrendingUp,
  Award,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  CheckCircle2,
  FileText,
  RefreshCw,
  Zap,
} from 'lucide-react';

type PeriodFilter = 'today' | 'week' | 'month' | 'all';

export const ReportsView: React.FC = () => {
  const { organization } = useAuth();
  const currencyCode = organization?.currency || 'USD';

  // ── Use a ref so real-time callbacks always read the LATEST orgId ──────────
  const orgIdRef = useRef<string>(organization?.id || DEFAULT_ORG_ID);
  const orgId = organization?.id || DEFAULT_ORG_ID;
  // Keep ref in sync every render
  orgIdRef.current = orgId;

  const [sales, setSales] = useState<Sale[]>([]);
  const [mechanics, setMechanics] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>('today');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);
  const [newSaleFlash, setNewSaleFlash] = useState(false);

  // ── Plain fetch – reads orgIdRef so it always gets the current value ────────
  const doFetch = async (silent = false) => {
    const currentOrgId = orgIdRef.current;
    if (!silent) setLoading(true);

    const { data: salesData, error: salesErr } = await supabase
      .from('sales')
      .select(
        `*, client:clients(*), mechanic:profiles!sales_mechanic_id_fkey(*), items:sale_items(*)`
      )
      .eq('organization_id', currentOrgId)
      .order('created_at', { ascending: false });

    if (!salesErr && salesData) {
      setSales(salesData as Sale[]);
      setLastUpdated(new Date());
    } else if (salesErr) {
      console.error('[ReportsView] fetch error:', salesErr.message);
    }

    const { data: mechData } = await supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', currentOrgId)
      .in('role', ['mechanic', 'admin']);

    if (mechData) setMechanics(mechData as Profile[]);

    if (!silent) setLoading(false);
  };

  // ── Fetch on mount and whenever orgId changes ────────────────────────────────
  useEffect(() => {
    doFetch();
  }, [orgId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Real-time subscription (separate effect, no orgId in deps so it only ───
  // ── mounts/unmounts once per component lifetime) ────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('reports-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sales' },
        (payload) => {
          const record = payload.new as any;
          // Always use ref to get latest orgId — avoids stale closure bug
          if (!record || record.organization_id === orgIdRef.current) {
            setNewSaleFlash(true);
            setTimeout(() => setNewSaleFlash(false), 2500);
            doFetch(true);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sales' },
        () => {
          doFetch(true);
        }
      )
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsLive(false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Date helpers (recalculated each render for accuracy) ─────────────────────
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  ).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  // ── Period tabs ───────────────────────────────────────────────────────────────
  const todaySales  = sales.filter(s => new Date(s.created_at || 0).getTime() >= startOfToday);
  const weekSales   = sales.filter(s => new Date(s.created_at || 0).getTime() >= startOfWeek);
  const monthSales  = sales.filter(s => new Date(s.created_at || 0).getTime() >= startOfMonth);

  const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const weekRevenue  = weekSales.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const monthRevenue = monthSales.reduce((sum, s) => sum + Number(s.total || 0), 0);

  const filteredSales = sales.filter(s => {
    const t = new Date(s.created_at || 0).getTime();
    if (period === 'today') return t >= startOfToday;
    if (period === 'week')  return t >= startOfWeek;
    if (period === 'month') return t >= startOfMonth;
    return true;
  });

  const totalRevenue     = filteredSales.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const totalCommissions = filteredSales.reduce((sum, s) => sum + Number(s.mechanic_commission_amount || 0), 0);
  const averageTicket    = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  const cashTotal     = filteredSales.filter(s => s.payment_method === 'cash').reduce((sum, s) => sum + Number(s.total), 0);
  const cardTotal     = filteredSales.filter(s => s.payment_method === 'card').reduce((sum, s) => sum + Number(s.total), 0);
  const transferTotal = filteredSales.filter(s => s.payment_method === 'transfer').reduce((sum, s) => sum + Number(s.total), 0);

  const commissionsByMechanic = mechanics.map(m => {
    const mechSales = filteredSales.filter(s => s.mechanic_id === m.id);
    return {
      mechanic: m,
      servicesCount:    mechSales.length,
      totalBilled:      mechSales.reduce((sum, s) => sum + Number(s.subtotal), 0),
      earnedCommission: mechSales.reduce((sum, s) => sum + Number(s.mechanic_commission_amount), 0),
    };
  });

  const periodLabels: Record<PeriodFilter, { title: string; subtitle: string }> = {
    today: { title: 'Ventas de Hoy',              subtitle: `Fecha: ${now.toLocaleDateString()}` },
    week:  { title: 'Ventas de Esta Semana',       subtitle: 'Lunes a Domingo en curso' },
    month: { title: 'Ventas de Este Mes',          subtitle: `${now.toLocaleString('default', { month: 'long' }).toUpperCase()} ${now.getFullYear()}` },
    all:   { title: 'Histórico Total Acumulado',   subtitle: 'Todas las ventas registradas' },
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 pb-20 lg:pb-8">

      {/* Header */}
      <div className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-500 ${newSaleFlash ? 'border-emerald-500 shadow-emerald-500/20' : 'border-slate-800'}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Reportes Financieros y Comisiones</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Ventas diarias, semanales y mensuales actualizadas en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className={isLive ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {isLive ? 'En vivo' : 'Conectando...'}
            </span>
          </div>

          <span className="text-[10px] text-slate-500 hidden sm:block">
            {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>

          <button
            onClick={() => doFetch()}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* New sale toast */}
      {newSaleFlash && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-xl px-4 py-2.5 text-sm text-emerald-300 font-semibold">
          <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
          ¡Nueva venta detectada! Datos actualizados automáticamente.
        </div>
      )}

      {/* Period Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* HOY */}
        <button onClick={() => setPeriod('today')} className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${period === 'today' ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${period === 'today' ? 'text-amber-400' : 'text-slate-400'}`}>☀️ Hoy</span>
            <span className="text-[10px] px-1.5 rounded bg-slate-800 text-slate-400">{todaySales.length} trans.</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatCurrency(todayRevenue, currencyCode)}</span>
          <span className="text-[10px] text-slate-400 mt-1">Cierre del día</span>
        </button>

        {/* SEMANA */}
        <button onClick={() => setPeriod('week')} className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${period === 'week' ? 'bg-blue-500/15 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${period === 'week' ? 'text-blue-400' : 'text-slate-400'}`}>📅 Semana</span>
            <span className="text-[10px] px-1.5 rounded bg-slate-800 text-slate-400">{weekSales.length} trans.</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatCurrency(weekRevenue, currencyCode)}</span>
          <span className="text-[10px] text-slate-400 mt-1">Lunes a Domingo</span>
        </button>

        {/* MES */}
        <button onClick={() => setPeriod('month')} className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${period === 'month' ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${period === 'month' ? 'text-emerald-400' : 'text-slate-400'}`}>📊 Este Mes</span>
            <span className="text-[10px] px-1.5 rounded bg-slate-800 text-slate-400">{monthSales.length} trans.</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatCurrency(monthRevenue, currencyCode)}</span>
          <span className="text-[10px] text-slate-400 mt-1">Mes actual</span>
        </button>

        {/* HISTÓRICO */}
        <button onClick={() => setPeriod('all')} className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${period === 'all' ? 'bg-purple-500/15 border-purple-500 shadow-lg shadow-purple-500/10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${period === 'all' ? 'text-purple-400' : 'text-slate-400'}`}>🗄️ Histórico</span>
            <span className="text-[10px] px-1.5 rounded bg-slate-800 text-slate-400">{sales.length} total</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatCurrency(sales.reduce((sum, s) => sum + Number(s.total || 0), 0), currencyCode)}</span>
          <span className="text-[10px] text-slate-400 mt-1">Acumulado total</span>
        </button>
      </div>

      {/* Active Period Banner */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white">{periodLabels[period].title}</span>
          <span className="text-slate-400">• {periodLabels[period].subtitle}</span>
        </div>
        <span className="text-[11px] text-amber-400 font-mono font-semibold">{filteredSales.length} facturas</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Facturación del Período</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono my-2">{formatCurrency(totalRevenue, currencyCode)}</span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {filteredSales.length} transacciones</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Comisiones Mecánicos</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono my-2">{formatCurrency(totalCommissions, currencyCode)}</span>
          <span className="text-[11px] text-slate-400">Devengadas en este período</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Ticket Promedio</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono my-2">{formatCurrency(averageTicket, currencyCode)}</span>
          <span className="text-[11px] text-slate-400">Gasto medio por servicio</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Margen Operativo Est.</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono my-2">42.8%</span>
          <span className="text-[11px] text-purple-300">Rendimiento de lubricación</span>
        </div>
      </div>

      {/* Commissions + Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commissions table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Comisiones ({periodLabels[period].title})</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Total: <strong className="text-blue-400">${totalCommissions.toFixed(2)}</strong></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Mecánico</th>
                  <th className="p-3">% Tasa</th>
                  <th className="p-3">Servicios</th>
                  <th className="p-3">Facturado</th>
                  <th className="p-3 text-right">Comisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {commissionsByMechanic.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">Sin personal registrado.</td></tr>
                ) : (
                  commissionsByMechanic.map(item => (
                    <tr key={item.mechanic.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <div className="font-bold text-white">{item.mechanic.full_name}</div>
                        <div className="text-[10px] text-slate-500 capitalize">{item.mechanic.role}</div>
                      </td>
                      <td className="p-3 font-mono font-semibold text-amber-400">{item.mechanic.commission_percentage}%</td>
                      <td className="p-3 text-slate-300 font-mono">{item.servicesCount}</td>
                      <td className="p-3 font-mono text-slate-300">${item.totalBilled.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">${item.earnedCommission.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Por Forma de Pago</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Efectivo', sub: 'Caja física', amount: cashTotal, color: 'emerald', Icon: Banknote },
                { label: 'Tarjetas', sub: 'POS Datafast / Medianet', amount: cardTotal, color: 'blue', Icon: CreditCard },
                { label: 'Transferencia', sub: 'DeUna / Banco Pichincha', amount: transferTotal, color: 'purple', Icon: Smartphone },
              ].map(({ label, sub, amount, color, Icon }) => (
                <div key={label} className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 text-${color}-400 flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">{label}</span>
                      <span className="text-[10px] text-slate-400">{sub}</span>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-${color}-400 text-sm`}>${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Filtrado por: <strong className="text-amber-400">{periodLabels[period].title}</strong>
          </div>
        </div>
      </div>

      {/* Sales History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Historial de Tickets — {periodLabels[period].title}</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total: <strong className="text-amber-400">${totalRevenue.toFixed(2)}</strong>
          </span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/40 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">N° Factura</th>
                  <th className="p-3.5">Fecha / Hora</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Mecánico</th>
                  <th className="p-3.5">Método</th>
                  <th className="p-3.5 text-right">Subtotal</th>
                  <th className="p-3.5 text-right">IVA</th>
                  <th className="p-3.5 text-right font-black">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No hay ventas en este período. Registra una venta en el módulo POS.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-800/30 transition ${idx === 0 && newSaleFlash ? 'bg-emerald-500/5 border-l-2 border-emerald-500' : ''}`}
                    >
                      <td className="p-3.5 font-mono font-bold text-amber-400 text-xs">{s.invoice_number}</td>
                      <td className="p-3.5 text-slate-400 text-xs font-mono">
                        {new Date(s.created_at || '').toLocaleDateString()}{' '}
                        {new Date(s.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5 text-white font-medium">{(s as any).client?.full_name || 'Consumidor Final'}</td>
                      <td className="p-3.5 text-slate-300">{(s as any).mechanic?.full_name || 'Sin asignar'}</td>
                      <td className="p-3.5 capitalize text-slate-400">{s.payment_method}</td>
                      <td className="p-3.5 text-right font-mono text-slate-300">${Number(s.subtotal).toFixed(2)}</td>
                      <td className="p-3.5 text-right font-mono text-slate-400">${Number(s.tax).toFixed(2)}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-white">${Number(s.total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
