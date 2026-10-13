import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_COUNTRIES, SUPPORTED_CURRENCIES, formatCurrency, getCurrencySymbol } from '../../lib/currency';
import {
  Settings as SettingsIcon,
  Globe,
  Coins,
  Percent,
  Receipt,
  MessageSquare,
  Building,
  CheckCircle2,
  AlertCircle,
  Save,
  HelpCircle,
  Sparkles,
  Lock,
  Layers,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { organization, updateOrganization, isDemoMode, currentRole } = useAuth();

  // Local form state
  const [name, setName] = useState(organization?.name || '');
  const [rucNit, setRucNit] = useState(organization?.ruc_nit || '');
  const [phone, setPhone] = useState(organization?.phone || '');
  const [email, setEmail] = useState(organization?.email || '');
  const [address, setAddress] = useState(organization?.address || '');
  const [city, setCity] = useState(organization?.city || '');
  const [country, setCountry] = useState(organization?.country || 'Ecuador');
  const [currency, setCurrency] = useState(organization?.currency || 'USD');
  const [taxPercentage, setTaxPercentage] = useState<number>(Number(organization?.tax_percentage ?? 15));
  const [taxName, setTaxName] = useState(organization?.tax_name || 'IVA');
  const [invoicePrefix, setInvoicePrefix] = useState(organization?.invoice_prefix || 'FAC');
  const [receiptFooter, setReceiptFooter] = useState(
    organization?.receipt_footer || '¡Gracias por confiar en nosotros! Recuerde revisar el nivel de aceite cada 1,000 km.'
  );
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    organization?.whatsapp_template ||
      'Hola {cliente}, le recordamos de {taller} que su vehículo {vehiculo} está próximo a su cambio de aceite en {km} km. ¡Agende su cita hoy!'
  );

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'finance' | 'receipt' | 'crm'>('general');

  // Handle Country selection with automatic smart defaults
  const handleCountryChange = (countryName: string) => {
    setCountry(countryName);
    const matched = SUPPORTED_COUNTRIES.find((c) => c.name === countryName);
    if (matched) {
      setCurrency(matched.defaultCurrency);
      setTaxName(matched.defaultTaxName);
      setTaxPercentage(matched.defaultTaxPercentage);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const updates = {
      name,
      ruc_nit: rucNit,
      phone,
      email,
      address,
      city,
      country,
      currency,
      tax_percentage: Number(taxPercentage),
      tax_name: taxName,
      invoice_prefix: invoicePrefix,
      receipt_footer: receiptFooter,
      whatsapp_template: whatsappTemplate,
    };

    const { error } = await updateOrganization(updates);

    setSaving(false);
    if (error) {
      setErrorMessage('No se pudieron guardar los ajustes. Intenta de nuevo.');
    } else {
      setSuccessMessage('¡Ajustes guardados con éxito en la organización!');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const currentCountryConfig = SUPPORTED_COUNTRIES.find((c) => c.name === country);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 pb-24 lg:pb-10">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Ajustes & Parámetros del Taller</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Personaliza el país, la moneda del sistema, impuestos, prefijo de facturas y plantillas de WhatsApp.
          </p>
        </div>

        {/* Live Currency Preview pill */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Moneda activa:</span>
          <span className="text-white font-mono font-bold">{currency} ({getCurrencySymbol(currency)})</span>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-xl px-4 py-3 text-sm text-emerald-300 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/40 rounded-xl px-4 py-3 text-sm text-rose-300 font-semibold animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'general', label: '1. Datos de Empresa & País', icon: Globe },
          { id: 'finance', label: '2. Moneda & Impuestos', icon: Coins },
          { id: 'receipt', label: '3. Comprobantes & Ticket', icon: Receipt },
          { id: 'crm', label: '4. Plantilla de WhatsApp', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: GENERAL & COUNTRY */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Building className="w-4 h-4 text-amber-400" />
                Información Comercial del Taller
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nombre Comercial del Negocio *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Lubricadora Pestana"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {currentCountryConfig?.taxIdLabel || 'RUC / NIT / Identificación Fiscal'}
                  </label>
                  <input
                    type="text"
                    value={rucNit}
                    onChange={(e) => setRucNit(e.target.value)}
                    placeholder="Ej. 1792458921001"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    País de Operación
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} ({c.defaultCurrency} • {c.phonePrefix})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-amber-400/80 mt-1">
                    Al seleccionar el país, se sugieren automáticamente la moneda y el impuesto oficial.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. Quito / Medellín / CDMX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teléfono / WhatsApp de Contacto
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +593 99 876 5432"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@lubricadora.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Dirección Física del Establecimiento
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Av. Simón Bolívar y Los Naranjos, Local 4"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Quick summary card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Resumen de Identidad
              </h3>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
                <p className="text-white font-bold text-sm">{name || 'Mi Lubricadora'}</p>
                <p className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {city ? `${city}, ` : ''}{country}
                </p>
                <p className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {phone || 'Sin teléfono configurado'}
                </p>
                <p className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {email || 'Sin correo configurado'}
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 leading-relaxed">
                💡 Estos datos aparecerán impresos en el encabezado del ticket térmico y en el mensaje de confirmación que recibe el cliente por WhatsApp.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINANCE & CURRENCY */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Coins className="w-4 h-4 text-amber-400" />
                Moneda & Configuración Impositiva
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Moneda de Facturación
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    {SUPPORTED_CURRENCIES.map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.name} ({cur.symbol})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Afecta el símbolo en POS, Inventario, Reportes y Comprobantes.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nombre del Impuesto
                  </label>
                  <input
                    type="text"
                    value={taxName}
                    onChange={(e) => setTaxName(e.target.value)}
                    placeholder="Ej. IVA, IGV, Sales Tax"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Texto que se mostrará en el desglose de totales.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Porcentaje de Impuesto (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={taxPercentage}
                      onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ecuador: 15% • Colombia: 19% • México: 16% • Perú: 18%
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Prefijo de Factura / Ticket
                  </label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                    placeholder="FAC"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ej: FAC-100-001, TCK-001, etc.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Calculation preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                Simulador en Tiempo Real
              </h3>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal servicio:</span>
                  <span>{formatCurrency(50, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{taxName} ({taxPercentage}%):</span>
                  <span>{formatCurrency(50 * (taxPercentage / 100), currency)}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold pt-2 border-t border-slate-800 text-sm">
                  <span>Total al cliente:</span>
                  <span>{formatCurrency(50 + 50 * (taxPercentage / 100), currency)}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 leading-relaxed">
                ✨ Con estos valores, el módulo POS calculará automáticamente el total usando el símbolo <strong>{getCurrencySymbol(currency)}</strong> y la tasa del <strong>{taxPercentage}%</strong>.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RECEIPT */}
        {activeTab === 'receipt' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-amber-400" />
              Pie de Página del Ticket Térmico
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mensaje de despedida y recomendaciones al cliente
              </label>
              <textarea
                rows={3}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                placeholder="¡Gracias por su preferencia! Próximo cambio recomendado a los 5,000 km."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Este mensaje se imprimirá al final de cada ticket térmico entregado al conductor.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CRM WHATSAPP */}
        {activeTab === 'crm' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Plantilla de Recordatorio por WhatsApp
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Texto del Mensaje Automatizado
              </label>
              <textarea
                rows={4}
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                placeholder="Hola {cliente}, le recordamos de {taller}..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-sans"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-amber-400 font-mono">
                  {'{cliente}'}
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-amber-400 font-mono">
                  {'{taller}'}
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-amber-400 font-mono">
                  {'{vehiculo}'}
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-amber-400 font-mono">
                  {'{km}'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Las variables entre corchetes serán reemplazadas por los datos reales del cliente en el CRM.
              </p>
            </div>
          </div>
        )}

        {/* Save button bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Guardando ajustes...' : 'Guardar Ajustes'}
          </button>
        </div>
      </form>

      {/* Ideas de valor adicionales para el SaaS */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Sugerencias de Próximas Mejoras para este Módulo de Ajustes</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Para que el SaaS sea el sistema líder en talleres y lubricadoras, hemos preparado este módulo para recibir fácilmente:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-white block mb-1">🛢️ Capacidad de Alerta de Tambores</span>
            <span className="text-slate-400">Umbral configurable de litros mínimos antes de disparar alerta roja en inventario.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-white block mb-1">👨‍🔧 Reglas de Comisión por Rol</span>
            <span className="text-slate-400">Comisión diferenciada por cambio de aceite (10%) vs filtros o mano de obra adicional.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-white block mb-1">🧾 Integración Facturación Electrónica</span>
            <span className="text-slate-400">Carga de firma digital (.p12) y envío directo al SRI (Ecuador), DIAN (Colombia) o SAT (México).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
