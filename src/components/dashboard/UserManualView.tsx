import React, { useState } from 'react';
import {
  BookOpen,
  ShoppingCart,
  Car,
  Package,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Layers,
  Wrench,
  Smartphone,
  Printer,
  Sparkles,
  HelpCircle,
  Clock,
  Send,
  Fuel,
  TrendingUp,
  CreditCard,
  Banknote,
  Search,
  ChevronRight
} from 'lucide-react';

export const UserManualView: React.FC<{ onNavigateToTab?: (tab: string) => void }> = ({ onNavigateToTab }) => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections = [
    { id: 'intro', label: '1. Introducción & Roles', icon: ShieldCheck, color: 'text-amber-400' },
    { id: 'pos', label: '2. Módulo POS & Cobro', icon: ShoppingCart, color: 'text-blue-400' },
    { id: 'vehicles', label: '3. Buscador Técnico de Aceites', icon: Car, color: 'text-purple-400' },
    { id: 'inventory', label: '4. Inventario & Tambores (208L)', icon: Package, color: 'text-amber-400' },
    { id: 'crm', label: '5. CRM WhatsApp Automático', icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'reports', label: '6. Reportes & Comisiones', icon: BarChart3, color: 'text-cyan-400' },
    { id: 'faq', label: '7. Preguntas Frecuentes & Tips', icon: HelpCircle, color: 'text-rose-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 pb-24 lg:pb-12 text-slate-100">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Centro de Ayuda y Manual Interactivo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
              Manual de Usuario — <span className="gradient-text-oil">LUBRIX Pro</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Guía visual interactiva paso a paso para dominar el sistema, agilizar tus ventas, controlar el inventario de tambores y fidelizar clientes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/80 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Versión 2.0 Cloud • Supabase Postgres</span>
          </div>
        </div>
      </div>

      {/* QUICK SECTION SELECTOR TABS (SCROLLABLE) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : sec.color}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION CONTENT */}
      <div className="grid grid-cols-1 gap-6">

        {/* 1. INTRODUCCIÓN & ROLES */}
        {activeSection === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                1. Estructura del Sistema y Perfiles de Usuario
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                LUBRIX Pro está optimizado para funcionar en múltiples dispositivos simultáneamente (computadora de caja, tablet de fosa o celular del mecánico). Cada rol de usuario tiene funciones adaptadas a su labor en el taller:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Admin */}
                <div className="bg-slate-800/70 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-3">
                      👑
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Administrador / Propietario</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Control total del negocio, reportes de facturación general, configuración de stock y liquidación de comisiones.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Métricas financieras en vivo
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ajustes de precios e inventario
                    </div>
                  </div>
                </div>

                {/* Mechanic */}
                <div className="bg-slate-800/70 border border-blue-500/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-3">
                      🔧
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Mecánico de Bahía / Fosa</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Uso de tablet o celular para verificar viscosidades OEM, capacidades en litros de cárter y seguimiento de sus comisiones.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-blue-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Buscador técnico de aceites
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Comisiones por servicio devengadas
                    </div>
                  </div>
                </div>

                {/* Cashier */}
                <div className="bg-slate-800/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                      💳
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Cajera / Mostrador</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Emisión ultrarrápida de tickets y facturas, registro de clientes y control de cobros en efectivo, tarjeta o transferencias.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Cobro en menos de 3 toques
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Impresión y envío WhatsApp
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick tip box */}
              <div className="mt-6 p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-white block font-semibold mb-0.5">💡 Tip de Navegación Rápida:</strong>
                  Puedes cambiar de rol al instante desde el encabezado superior con el selector de roles (*Admin | Mecánico | Cajera*) para experimentar cómo se visualiza cada módulo para tu equipo de trabajo.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MÓDULO POS */}
        {activeSection === 'pos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                2. Paso a Paso: Facturación y Cobro en el POS
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                El POS descuenta el inventario de forma automática a nivel milimétrico y calcula comisiones del mecánico en tiempo real.
              </p>

              {/* Steps timeline */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-black text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Buscar o Escanear Producto</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Escribe el nombre del lubricante (*ej. Motul 5W-40*), código o filtro (*PH3593A*). También puedes usar lector de código de barras físico.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-900 text-blue-400 rounded-lg border border-slate-700">
                    Búsqueda instantánea
                  </span>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Seleccionar Presentación de Venta</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Si es aceite, elige si vendes en **Litro suelto (1L)**, **Cuarto (0.946L / 1 Qt)**, **Galón (3.785L)** o **Tambor (208L)**. El precio y factor de descuento se calculan solos.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-900 text-amber-400 rounded-lg border border-slate-700">
                    Conversión multi-unidad
                  </span>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Asignar Vehículo y Mecánico</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Elige al cliente o *"Consumidor Final"*. Si seleccionas el auto, escribe el **kilometraje actual** (ej. 48,500 km). Elige al mecánico para registrar su comisión (ej. 10%).
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-900 text-purple-400 rounded-lg border border-slate-700">
                    Comisión en vivo
                  </span>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Cobrar y Entregar Comprobante</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Selecciona Efectivo, Tarjeta, Transferencia o Crédito. Al hacer clic en **Cobrar**, se guarda en Supabase, se descuenta el stock y puedes imprimir el ticket o enviarlo por WhatsApp.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-900 text-emerald-400 rounded-lg border border-slate-700">
                    Ticket con QR & WhatsApp
                  </span>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('pos')}
                  className="mt-6 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <span>Ir al Módulo POS Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. BUSCADOR TÉCNICO */}
        {activeSection === 'vehicles' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Car className="w-5 h-5 text-purple-400" />
                3. Buscador Técnico de Viscosidad y Filtros OEM
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Guía técnica de lubricación para evitar equivocaciones en el tipo de aceite o tamaño de filtro.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-4 h-4" /> Búsqueda por Selectores en Cascada
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Selecciona la **Marca** (ej. *Toyota, Chevrolet, Hyundai, Ford, Nissan*).<br/>
                    2. Selecciona el **Modelo** (ej. *Hilux, Aveo, Tucson, D-Max*).<br/>
                    3. Selecciona la versión de **Motor y Año** (ej. *2.8 Turbo Diesel 2016-2024*).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
                  <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" /> Datos de la Ficha Técnica
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• **Viscosidad:** Ej. 0W-20, 5W-30 Low SAPS o 10W-40.</li>
                    <li>• **Capacidad del Cárter:** Litros exactos (ej. 7.5 Litros = 8 Cuartos).</li>
                    <li>• **Filtro de Aceite:** Códigos OEM y Aftermarket (Mann, Fram, OEM).</li>
                    <li>• **Filtros Adicionales:** Códigos de Filtro de Aire y Filtro de Cabina.</li>
                  </ul>
                </div>
              </div>

              {/* One click feature */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-slate-800 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Botón "Cargar en el POS"</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Al presionar este botón dentro de cualquier vehículo, el sistema te redirige al POS cargando el aceite recomendado listo para cobrar.
                  </p>
                </div>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('vehicles')}
                    className="py-2 px-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>Probar Buscador</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. INVENTARIO & TAMBORES */}
        {activeSection === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                4. Control de Inventario y Descuento por Tambores (208L)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                El corazón de LUBRIX Pro: Administra el stock en **Litros Base** y visualiza automáticamente cuántos tambores, galones y cuartos tienes disponibles.
              </p>

              {/* Conversion Table Visual */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                  Tabla de Factores de Conversión del Sistema:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700">
                    <span className="text-lg font-black text-amber-400 font-mono block">208.0 L</span>
                    <span className="text-xs text-white font-semibold">1 Tambor Industrial</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">55 Galones US</span>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700">
                    <span className="text-lg font-black text-blue-400 font-mono block">3.785 L</span>
                    <span className="text-xs text-white font-semibold">1 Galón (1 Gal)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">4 Cuartos</span>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700">
                    <span className="text-lg font-black text-purple-400 font-mono block">0.946 L</span>
                    <span className="text-xs text-white font-semibold">1 Cuarto (1 Qt)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Envase común</span>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700">
                    <span className="text-lg font-black text-emerald-400 font-mono block">1.000 L</span>
                    <span className="text-xs text-white font-semibold">1 Litro Suelto</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Unidad base</span>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Descuento Milimétrico:</strong> Si compras un tambor de 208 litros e ingresas una venta de 4 cuartos (4 x 0.946L = 3.784L), el trigger en Supabase resta exactamente 3.784 litros del stock base, dejando 204.216 litros sin descuadre.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Ajuste Físico Rápido:</strong> Al realizar arqueo semanal en bodega, haz clic en el icono de lápiz (✏️) en la fila del producto para corregir el stock en segundos.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Alertas de Stock Mínimo:</strong> Cuando el stock baje del límite de seguridad configurado, el producto se resaltará en rojo con badge de alerta para reabastecer con tu proveedor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CRM WHATSAPP */}
        {activeSection === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                5. Fidelización y Recordatorios de WhatsApp con 1 Clic
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Recupera y fideliza a tus clientes notificándoles de forma profesional cuando su vehículo esté por cumplir los 5,000 km o 6 meses desde su último cambio de aceite.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Cálculo Automático de Vencimiento
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cada vez que cobras un mantenimiento en el POS registrando el kilometraje (ej. 45,000 km), el sistema calcula el próximo cambio:
                  </p>
                  <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-700 font-mono text-xs text-amber-300 space-y-1">
                    <div>Km Siguiente: <span className="text-white font-bold">50,000 km (+5,000 km)</span></div>
                    <div>Fecha Proyectada: <span className="text-white font-bold">+6 meses</span></div>
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-emerald-500/40 rounded-xl p-4">
                  <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Mensaje de WhatsApp Generado
                  </h4>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-[11px] text-slate-200 leading-relaxed font-sans italic">
                    "Hola Juan Pérez! 🏁 Te saludamos de LubriExpress Pro. Te recordamos que tu Toyota Hilux (PCJ-4589) está cumpliendo su ciclo preventivo de cambio de aceite registrado a los 48,500 km. ¿Deseas agendar tu turno hoy mismo para proteger el motor?..."
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <span>Al hacer clic en "Enviar WhatsApp", el sistema registra la fecha y marca la casilla verde de enviado.</span>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('crm')}
                    className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs ml-2 shrink-0 transition"
                  >
                    Ver Lista de Clientes
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. REPORTES & COMISIONES */}
        {activeSection === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                6. Panel Financiero y Control de Comisiones
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Supervisa el dinero que entra a caja y liquida con precisión matemática las comisiones ganadas por cada mecánico.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Facturación Bruta</span>
                  <p className="text-base font-bold text-amber-400 mt-1">Total ventas con IVA</p>
                  <span className="text-[10px] text-slate-500">Histórico auditable</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Comisiones a Pagar</span>
                  <p className="text-base font-bold text-blue-400 mt-1">Liquidación de personal</p>
                  <span className="text-[10px] text-slate-500">Basado en % por rol</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Caja por Método</span>
                  <p className="text-base font-bold text-emerald-400 mt-1">Efectivo, Tarjeta, Transf.</p>
                  <span className="text-[10px] text-slate-500">Arqueo diario exacto</span>
                </div>
              </div>

              <div className="p-4 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-slate-300">
                <strong className="text-white block font-semibold mb-1">¿Cómo se liquida la comisión de cada mecánico?</strong>
                Al asociar una venta al mecánico en el POS, el sistema toma el subtotal de la mano de obra y lubricantes y aplica su porcentaje pactado (ej. 10% sobre $68.00 = $6.80 de comisión acumulada). Al final del turno o quincena, puedes consultar la tabla y pagarle su valor exacto sin disputas.
              </div>
            </div>
          </div>
        )}

        {/* 7. FAQ & TIPS */}
        {activeSection === 'faq' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-400" />
                7. Preguntas Frecuentes y Buenas Prácticas en el Taller
              </h2>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    ❓ ¿Qué pasa si un cliente compra aceite en envase y no hace el cambio en el taller?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Puedes vender el producto normalmente en el POS sin asignar vehículo ni mecánico. El stock se descontará igual y la venta se registrará a Consumidor Final.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    ❓ ¿Cómo usar el sistema desde un teléfono móvil?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    LUBRIX Pro detecta automáticamente la pantalla de tu celular y activa la barra inferior táctil (*Thumb Navigation*). Es ideal para que el mecánico consulte la viscosidad al lado del auto sin caminar hasta la caja.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    ❓ ¿Se pueden imprimir comprobantes en impresoras térmicas de 58mm o 80mm?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Sí. El modal del ticket térmico se adapta automáticamente al formato de impresión térmica estándar (*ESC/POS*) de rollos de papel y cuenta con botón de impresión directa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
