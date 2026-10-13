import React from 'react';
import { Sale, Organization } from '../../types/database';
import { formatCurrency } from '../../lib/currency';
import { X, Printer, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale | null;
  org: Organization | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, org, isOpen, onClose }) => {
  if (!isOpen || !sale) return null;

  const currencyCode = org?.currency || 'USD';
  const taxName = org?.tax_name || 'IVA';
  const taxPct = Number(org?.tax_percentage ?? 15);
  const footerMessage = org?.receipt_footer || '¡Gracias por confiar en nosotros! Recuerde revisar el nivel de aceite cada 1,000 km.';

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!sale.client?.phone) return;
    const cleanPhone = sale.client.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🏁 *COMPROBANTE DE SERVICIO - ${org?.name || 'LUBRIX'}*\n` +
      `Factura: *${sale.invoice_number}*\n` +
      `Cliente: ${sale.client.full_name}\n` +
      `Total: ${formatCurrency(sale.total, currencyCode)}\n` +
      `¡Gracias por confiar en nosotros para el cuidado de tu vehículo!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>¡Venta Guardada con Éxito!</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Ticket Content */}
        <div className="p-6 overflow-y-auto font-mono text-xs bg-white text-black selection:bg-yellow-200">
          <div className="text-center space-y-1 mb-4 border-b border-dashed border-gray-400 pb-3">
            <h2 className="font-black text-sm tracking-wide">{org?.name || 'LUBRIX EXPRESS PRO'}</h2>
            <p className="text-[10px] text-gray-600">RUC: {org?.ruc_nit || '1792458921001'}</p>
            <p className="text-[10px] text-gray-600">{org?.address || 'Av. Principal #102'}</p>
            <p className="text-[10px] text-gray-600">Tel: {org?.phone || '+593 99 876 5432'}</p>
          </div>

          <div className="space-y-1 mb-3 text-[11px]">
            <p><strong>N° FACTURA:</strong> {sale.invoice_number}</p>
            <p><strong>FECHA:</strong> {new Date(sale.created_at || Date.now()).toLocaleString()}</p>
            <p><strong>CLIENTE:</strong> {sale.client?.full_name || 'Consumidor Final'}</p>
            {sale.vehicle && (
              <p><strong>VEHÍCULO:</strong> {sale.vehicle.brand} {sale.vehicle.model} ({sale.vehicle.plate})</p>
            )}
            {sale.mechanic && (
              <p><strong>MECÁNICO:</strong> {sale.mechanic.full_name}</p>
            )}
          </div>

          <div className="border-t border-b border-dashed border-gray-400 py-2 my-2">
            <div className="flex justify-between font-bold mb-1 text-[11px]">
              <span>CANT / ARTÍCULO</span>
              <span>TOTAL</span>
            </div>
            {sale.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between py-0.5 text-[10px]">
                <span className="truncate pr-2">{it.quantity}x {it.description}</span>
                <span className="font-semibold">{formatCurrency(it.subtotal, currencyCode)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-right text-[11px] mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.subtotal, currencyCode)}</span>
            </div>
            <div className="flex justify-between">
              <span>{taxName} ({taxPct}%):</span>
              <span>{formatCurrency(sale.tax, currencyCode)}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1 border-t border-gray-300">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.total, currencyCode)}</span>
            </div>
            <p className="text-[9px] text-gray-500 pt-1 text-left">
              Método de pago: <strong>{sale.payment_method.toUpperCase()}</strong>
            </p>
          </div>

          <div className="text-center pt-2 border-t border-dashed border-gray-400 space-y-1">
            <p className="text-[9px] text-gray-600">*** GRACIAS POR SU PREFERENCIA ***</p>
            <p className="text-[8px] text-gray-500 leading-tight px-2">{footerMessage}</p>
            <div className="inline-block p-1 border border-gray-300 rounded mt-2">
              <ShieldCheck className="w-6 h-6 mx-auto text-gray-700" />
              <span className="text-[8px] text-gray-400 block">Factura Electrónica Validada</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            Imprimir Ticket
          </button>
          {sale.client?.phone && (
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Share2 className="w-4 h-4" />
              Enviar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
