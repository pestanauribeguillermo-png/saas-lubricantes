import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Car,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  PhoneCall,
  Clock,
  TrendingUp,
  Cpu,
  ChevronRight,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: () => void;
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onEnterDashboard }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Interactive Barrel Profit Calculator on Landing
  const [drumCost, setDrumCost] = useState(1350); // Cost of 208L drum ($)
  const [quartPrice, setQuartPrice] = useState(12); // Sale price per 0.946L quart ($)
  const quartsPerDrum = (208 / 0.946);
  const totalRevenuePerDrum = quartsPerDrum * quartPrice;
  const netProfitPerDrum = totalRevenuePerDrum - drumCost;
  const marginPercent = ((netProfitPerDrum / totalRevenuePerDrum) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Zap className="w-5 h-5 text-black font-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-lg tracking-wider font-['Outfit']">LUBRIX</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">SaaS para Lubricadoras y Centros Automotrices</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-amber-400 transition">Características</a>
          <a href="#calculator" className="hover:text-amber-400 transition">Calculadora Tambores</a>
          <a href="#catalog" className="hover:text-amber-400 transition">Catálogo Vehicular</a>
          <a href="#pricing" className="hover:text-amber-400 transition">Precios</a>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onEnterDashboard}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25 transition flex items-center gap-1.5 group"
          >
            <span>Ver Demo en Vivo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Glow backdrop blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-blue-600/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-medium text-amber-300">
              El Software Especializado #1 para Lubricadoras en Latinoamérica
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] font-['Outfit']">
            El ERP y POS todo-en-uno creado para{' '}
            <span className="gradient-text-oil">Lubricadoras Modernas</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Descuento automático de inventario por <strong className="text-amber-400">Tambor, Galón, Cuarto o Litro</strong>,
            buscador instantáneo de lubricantes y filtros OEM por vehículo, y recordatorios automáticos por{' '}
            <strong className="text-emerald-400">WhatsApp</strong> para fidelizar el próximo cambio de aceite.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Probar Sistema Ahora (Demo 100% Funcional)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <span>Crear Cuenta Gratis</span>
            </button>
          </div>

          {/* Micro trust stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Sin contratos forzosos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Sincronización en la Nube con Supabase</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Mobile-First: Úsalo en Celular, Tablet o PC</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE PREVIEW MOCKUP */}
        <div className="mt-12 relative rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden p-2 sm:p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 ml-2">app.lubrix.cloud/pos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                🟢 Supabase DB Conectado
              </span>
            </div>
          </div>

          {/* Interactive Mockup Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
            {/* Box 1: POS Touch */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <ShoppingCart className="w-4 h-4" />
                <h4 className="font-bold text-xs">POS Táctil & Facturación</h4>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Cobro en 3 toques con selección de presentación (Tambor, Galón, Cuarto) y cálculo de comisiones.
              </p>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-[10px] font-mono space-y-1">
                <div className="flex justify-between text-white">
                  <span>Mobil 1 0W-20 (4 Qts)</span>
                  <span className="text-amber-400">$48.00</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Filtro Toyota Hilux OEM</span>
                  <span>$11.50</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800">
                  <span>TOTAL:</span>
                  <span>$59.50</span>
                </div>
              </div>
            </div>

            {/* Box 2: Buscador Vehículos */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Car className="w-4 h-4" />
                <h4 className="font-bold text-xs">Catálogo Técnico OEM</h4>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Consulta instantánea de viscosidad, litros de cárter y filtros recomendados por marca y modelo.
              </p>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-[10px] font-mono space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Toyota Hilux 2.8 D-4D:</span>
                  <span className="text-amber-400 font-bold">5W-30 Low SAPS</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Capacidad de cárter:</span>
                  <span className="text-blue-400 font-bold">7.5 Litros</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Filtro de Aceite:</span>
                  <span className="text-emerald-400">90915-YZZD4</span>
                </div>
              </div>
            </div>

            {/* Box 3: WhatsApp CRM */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <MessageSquare className="w-4 h-4" />
                <h4 className="font-bold text-xs">CRM WhatsApp Automático</h4>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Envía recordatorios personalizados cuando el vehículo cumpla los 5.000 km o 6 meses.
              </p>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-[10px] text-emerald-300">
                💬 <em>"Hola Juan! Tu Toyota Hilux está próximo a su cambio de aceite (48.500 km)..."</em>
                <button
                  onClick={onEnterDashboard}
                  className="mt-2 w-full py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded text-center block"
                >
                  Probar Envío en Vivo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DRUM CONVERSION PROFIT CALCULATOR */}
      <section id="calculator" className="py-16 px-4 sm:px-8 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Rentabilidad Comprobada</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
              Calculadora de Ganancia por Tambor (208L)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Descubre cuántos dólares extra ganas fraccionando tambores industriales en cuartos y galones con LUBRIX.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Costo de Compra del Tambor (208 Litros):
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">$</span>
                  <input
                    type="range"
                    min="800"
                    max="2500"
                    step="50"
                    value={drumCost}
                    onChange={(e) => setDrumCost(Number(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="font-mono font-bold text-amber-400 w-20 text-right">${drumCost}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Precio de Venta al Público por Cuarto (0.946 L / 1 Qt):
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">$</span>
                  <input
                    type="range"
                    min="7"
                    max="22"
                    step="0.5"
                    value={quartPrice}
                    onChange={(e) => setQuartPrice(Number(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="font-mono font-bold text-amber-400 w-20 text-right">${quartPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Cuartos por cada tambor de 208L:</span>
                  <span className="font-mono font-bold text-white">{quartsPerDrum.toFixed(0)} cuartos</span>
                </div>
                <div className="flex justify-between">
                  <span>Galones equivalentes:</span>
                  <span className="font-mono font-bold text-white">{(208 / 3.785).toFixed(1)} galones</span>
                </div>
              </div>
            </div>

            {/* Results display */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Ganancia Neta por Tambor Vendido
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                  +${netProfitPerDrum.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Margen de ganancia bruto: <strong className="text-amber-400">{marginPercent}%</strong>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Facturación Bruta Total:</span>
                  <span className="font-mono font-bold text-white">${totalRevenuePerDrum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Costo de Adquisición:</span>
                  <span className="font-mono text-rose-400">-${drumCost.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onEnterDashboard}
                className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Administrar este Margen en LUBRIX</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Diseñado para la Grasa y el Taller</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
            6 Módulos Especializados que Transforman tu Negocio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Olvídate de cuadernos manchados de aceite y sistemas contables genéricos que no entienden de viscosidades ni tambores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">POS Táctil Ultrarrápido</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diseñado para pantallas táctiles de mostrador o tablets de fosa. Busca con lector de código de barras o por viscosidad y emite factura o ticket en 3 segundos.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Buscador de Aceites por Vehículo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tus mecánicos nunca más dudarán: selecciona Marca y Modelo y conoce al instante los litros de cárter, viscosidad exacta y códigos de filtro OEM compatibles.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Conversión Automática de Unidades</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compras en Tambor de 208L y vendes en cuartos o litros sueltos. El inventario se descuenta automáticamente a nivel milimétrico sin desfases de stock.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">CRM Posventa por WhatsApp</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              El sistema calcula cuándo el cliente cumplirá 5.000 km y genera un mensaje directo a su WhatsApp con un solo clic para traerlo de regreso al taller.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Comisiones de Mecánicos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Motiva a tu equipo calculando automáticamente las comisiones por cada cambio de aceite o servicio de mano de obra liquidado al final del día.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Reportes y Multi-sucursal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualiza ingresos en tiempo real, métodos de pago recibidos y controla una o varias sucursales desde tu teléfono donde quiera que estés.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-8 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Planes Transparentes</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
              Comienza Hoy y Multiplica tus Ventas
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Prueba gratuita por 14 días en todos los planes. Sin cobros automáticos.
            </p>

            {/* Toggle Monthly / Annual */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  billingCycle === 'monthly' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  billingCycle === 'annual' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="text-[10px] px-1 rounded bg-black/30 text-amber-300 font-mono">20% OFF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1: Básico */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Plan Básico</h3>
                <p className="text-xs text-slate-400 mt-1">Para lubricadoras pequeñas o fosa individual.</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-white font-mono">
                    ${billingCycle === 'monthly' ? '29' : '23'}
                  </span>
                  <span className="text-xs text-slate-400"> /mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 1 Sucursal / Local
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Hasta 2 Mecánicos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> POS & Control de Inventario
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Conversión Tambor / Galón / Litro
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Elegir Básico
              </button>
            </div>

            {/* Plan 2: Pro (Featured) */}
            <div className="relative bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-2 border-amber-500/80 rounded-2xl p-6 flex flex-col justify-between shadow-2xl shadow-amber-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase tracking-wider">
                ⭐ Más Popular
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Plan Pro</h3>
                <p className="text-xs text-slate-400 mt-1">Para lubricadoras con alto flujo y personal.</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-amber-400 font-mono">
                    ${billingCycle === 'monthly' ? '59' : '47'}
                  </span>
                  <span className="text-xs text-slate-400"> /mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Mecánicos Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> CRM WhatsApp Automático
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Catálogo Vehicular OEM Completo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Liquidación de Comisiones
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" /> Facturación Electrónica SRI / DIAN
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterDashboard}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs transition shadow-lg shadow-amber-500/25"
              >
                Probar Plan Pro Gratis
              </button>
            </div>

            {/* Plan 3: Multi-sucursal */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Plan Multi-Sucursal</h3>
                <p className="text-xs text-slate-400 mt-1">Para cadenas y redes de centros automotrices.</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-white font-mono">
                    ${billingCycle === 'monthly' ? '119' : '95'}
                  </span>
                  <span className="text-xs text-slate-400"> /mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Sucursales Ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Transferencia de Bodega Central
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Reportes Consolidados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Soporte VIP 24/7 por WhatsApp
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Contactar Ventas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 px-4 sm:px-8 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <span className="font-bold text-white">LUBRIX SaaS</span>
            <span className="text-slate-500">| Software de Lubricación Automotriz</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="#features" className="hover:text-white transition">Funcionalidades</a>
            <a href="#pricing" className="hover:text-white transition">Precios</a>
            <button onClick={onOpenAuth} className="hover:text-white transition">Acceso Clientes</button>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} LUBRIX Cloud Inc. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
