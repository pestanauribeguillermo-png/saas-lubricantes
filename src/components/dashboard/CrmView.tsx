import React, { useState, useEffect } from 'react';
import { supabase, DEFAULT_ORG_ID } from '../../lib/supabase';
import { ServiceHistory, Client, ClientVehicle } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Send,
  UserPlus,
  Car,
  User,
  Phone,
  ShieldCheck,
  X
} from 'lucide-react';

export const CrmView: React.FC = () => {
  const { organization } = useAuth();
  const orgId = organization?.id || DEFAULT_ORG_ID;

  const [services, setServices] = useState<ServiceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'due' | 'upcoming'>('all');
  const [search, setSearch] = useState('');

  // Add client modal
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    full_name: '',
    phone: '',
    document_id: '',
    email: '',
    plate: '',
    brand: '',
    model: '',
    year: 2020,
    current_mileage: 45000,
  });

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_history')
      .select(`
        *,
        client:clients(*),
        vehicle:client_vehicles(*),
        mechanic:profiles(*)
      `)
      .eq('organization_id', orgId)
      .order('next_change_date', { ascending: true });

    if (!error && data) {
      setServices(data as ServiceHistory[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, [orgId]);

  const handleSendWhatsApp = async (svc: ServiceHistory) => {
    if (!svc.client?.phone) {
      alert('El cliente no tiene un teléfono registrado.');
      return;
    }

    const cleanPhone = svc.client.phone.replace(/[^0-9]/g, '');
    const clientName = svc.client.full_name;
    const vehicleName = svc.vehicle ? `${svc.vehicle.brand} ${svc.vehicle.model}` : 'su vehículo';
    const plate = svc.vehicle?.plate ? `placa *${svc.vehicle.plate}*` : '';
    const orgName = organization?.name || 'LubriExpress Pro';

    const message = encodeURIComponent(
      `Hola *${clientName}*! 🏁\n\n` +
      `Te saludamos de *${orgName}*. Esperamos que todo marche excelente.\n\n` +
      `Te recordamos que tu *${vehicleName}* (${plate}) está cumpliendo el ciclo preventivo para su *cambio de aceite y filtro* (registrado a los ${svc.current_mileage.toLocaleString()} km).\n\n` +
      `Cuidar la lubricación a tiempo previene desgastes en el motor y reduce el consumo de combustible. 🚗💨\n\n` +
      `¿Deseas agendar tu turno para hoy o mañana? Responde a este mensaje para reservarte espacio prioritario. ¡Te esperamos!`
    );

    // Open WhatsApp
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');

    // Mark reminder as sent in Supabase
    await supabase
      .from('service_history')
      .update({
        whatsapp_reminder_sent: true,
        whatsapp_reminder_date: new Date().toISOString(),
      })
      .eq('id', svc.id);

    // Local state update
    setServices((prev) =>
      prev.map((item) =>
        item.id === svc.id
          ? { ...item, whatsapp_reminder_sent: true, whatsapp_reminder_date: new Date().toISOString() }
          : item
      )
    );
  };

  const handleCreateClientAndVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create client
      const { data: newCl, error: clErr } = await supabase
        .from('clients')
        .insert({
          organization_id: orgId,
          full_name: clientForm.full_name,
          phone: clientForm.phone,
          document_id: clientForm.document_id,
          email: clientForm.email || null,
        })
        .select()
        .single();

      if (clErr) throw clErr;

      // 2. Create vehicle
      const { data: newVh, error: vhErr } = await supabase
        .from('client_vehicles')
        .insert({
          organization_id: orgId,
          client_id: newCl.id,
          plate: clientForm.plate.toUpperCase(),
          brand: clientForm.brand,
          model: clientForm.model,
          year: clientForm.year,
          current_mileage: clientForm.current_mileage,
        })
        .select()
        .single();

      if (vhErr) throw vhErr;

      // 3. Create initial service reminder entry
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 5);

      await supabase.from('service_history').insert({
        organization_id: orgId,
        client_id: newCl.id,
        vehicle_id: newVh.id,
        current_mileage: clientForm.current_mileage,
        next_change_mileage: clientForm.current_mileage + 5000,
        next_change_date: nextDate.toISOString().split('T')[0],
        oil_used: 'Pendiente primer servicio',
        status: 'scheduled',
      });

      setIsClientModalOpen(false);
      fetchServices();
    } catch (err: any) {
      alert('Error registrando cliente: ' + err.message);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredServices = services.filter((s) => {
    const isDue = s.status === 'due' || s.next_change_date <= todayStr;
    if (filterTab === 'due' && !isDue) return false;
    if (filterTab === 'upcoming' && isDue) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const clientMatch = s.client?.full_name.toLowerCase().includes(q) || s.client?.phone.includes(q);
      const vehicleMatch = s.vehicle?.plate.toLowerCase().includes(q) || s.vehicle?.model.toLowerCase().includes(q);
      return clientMatch || vehicleMatch;
    }
    return true;
  });

  const dueCount = services.filter((s) => s.status === 'due' || s.next_change_date <= todayStr).length;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 pb-20 lg:pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">CRM & Recordatorios WhatsApp</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Avisa a tus clientes cuando su kilometraje o tiempo de cambio de aceite esté por vencer y fideliza tu cartera.
          </p>
        </div>

        <button
          onClick={() => setIsClientModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              filterTab === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({services.length})
          </button>
          <button
            onClick={() => setFilterTab('due')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              filterTab === 'due'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Vencidos / Requiere Cambio ({dueCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              filterTab === 'upcoming'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Próximos a Vencer
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, placa o celular..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Services CRM Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/80 text-slate-300 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3.5">Cliente & Teléfono</th>
                <th className="p-3.5">Vehículo & Placa</th>
                <th className="p-3.5">Último Servicio</th>
                <th className="p-3.5">Próximo Cambio (Fecha / Km)</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-center">Acción WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Cargando historial de mantenimientos...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No se encontraron clientes con mantenimientos en este filtro.
                  </td>
                </tr>
              ) : (
                filteredServices.map((svc) => {
                  const isDue = svc.status === 'due' || svc.next_change_date <= todayStr;

                  return (
                    <tr key={svc.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-xs sm:text-sm">
                          {svc.client?.full_name || 'Cliente sin nombre'}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-400 inline" />
                          <span>{svc.client?.phone || 'Sin número'}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-white text-xs sm:text-sm">
                          {svc.vehicle?.brand} {svc.vehicle?.model}
                        </div>
                        <div className="text-[11px] font-mono text-amber-400 font-bold">
                          {svc.vehicle?.plate}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="text-slate-300 font-mono text-xs">
                          {Number(svc.current_mileage).toLocaleString()} km
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                          {svc.oil_used || 'Cambio estándar'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className={`font-mono font-bold text-xs ${isDue ? 'text-rose-400' : 'text-slate-300'}`}>
                          {Number(svc.next_change_mileage).toLocaleString()} km
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{svc.next_change_date}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        {isDue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" />
                            Vencido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            <Clock className="w-3 h-3" />
                            Al Día
                          </span>
                        )}
                        {svc.whatsapp_reminder_sent && (
                          <span className="block text-[9px] text-emerald-400/80 mt-1">
                            ✓ WhatsApp enviado
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleSendWhatsApp(svc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-600/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Client & Vehicle Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Registrar Nuevo Cliente y Auto</h3>
              <button onClick={() => setIsClientModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClientAndVehicle} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={clientForm.full_name}
                  onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
                  placeholder="Ej. Roberto Andrade"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">WhatsApp / Celular</label>
                  <input
                    type="text"
                    required
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    placeholder="+593987654321"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Cédula / RUC</label>
                  <input
                    type="text"
                    value={clientForm.document_id}
                    onChange={(e) => setClientForm({ ...clientForm, document_id: e.target.value })}
                    placeholder="1712345678"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs font-semibold text-amber-400 mb-2">Datos del Vehículo</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Placa</label>
                    <input
                      type="text"
                      required
                      value={clientForm.plate}
                      onChange={(e) => setClientForm({ ...clientForm, plate: e.target.value })}
                      placeholder="PCJ-4589"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Marca</label>
                    <input
                      type="text"
                      required
                      value={clientForm.brand}
                      onChange={(e) => setClientForm({ ...clientForm, brand: e.target.value })}
                      placeholder="Toyota"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Modelo</label>
                    <input
                      type="text"
                      required
                      value={clientForm.model}
                      onChange={(e) => setClientForm({ ...clientForm, model: e.target.value })}
                      placeholder="Hilux"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Kilometraje Inicial</label>
                    <input
                      type="number"
                      required
                      value={clientForm.current_mileage}
                      onChange={(e) => setClientForm({ ...clientForm, current_mileage: parseInt(e.target.value) || 0 })}
                      placeholder="48000"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs transition"
              >
                Guardar Cliente y Activar Recordatorios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
