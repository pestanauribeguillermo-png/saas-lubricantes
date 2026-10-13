import React, { useState, useEffect } from 'react';
import { supabase, DEFAULT_ORG_ID } from '../../lib/supabase';
import { Product, ProductPresentation, Client, ClientVehicle, Profile, Sale, SaleItem } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { ReceiptModal } from '../common/ReceiptModal';
import { formatCurrency, getCurrencySymbol } from '../../lib/currency';
import confetti from 'canvas-confetti';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Car,
  User,
  Wrench,
  CreditCard,
  Banknote,
  Smartphone,
  Layers,
  Sparkles,
  Barcode,
  Package,
  AlertCircle
} from 'lucide-react';

interface CartItem {
  product: Product;
  presentation?: ProductPresentation;
  quantity: number;
  unitPrice: number;
  factorDeducted: number;
  subtotal: number;
}

export const POSView: React.FC<{ preloadedVehicleInfo?: any }> = ({ preloadedVehicleInfo }) => {
  const { organization, profile } = useAuth();
  const orgId = organization?.id || DEFAULT_ORG_ID;

  // DB Data
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientVehicles, setClientVehicles] = useState<ClientVehicle[]>([]);
  const [mechanics, setMechanics] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart & POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<ClientVehicle | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<Profile | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'credit'>('cash');
  const [currentMileageInput, setCurrentMileageInput] = useState<string>('');

  // Selected product modal for presentation choosing
  const [activeProductForPresentation, setActiveProductForPresentation] = useState<Product | null>(null);

  // Completed sale for receipt
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [processingSale, setProcessingSale] = useState(false);

  // Fetch initial data from Supabase (Strict Multi-tenant by orgId)
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Products with presentations for this organization
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select(`
          *,
          presentations:product_presentations(*)
        `)
        .eq('organization_id', orgId)
        .order('name');

      if (!prodErr && prodData) {
        setProducts(prodData as Product[]);
      }

      // 2. Clients for this organization
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', orgId)
        .order('full_name');
      if (clientData) setClients(clientData as Client[]);

      // 3. Vehicles for this organization
      const { data: vehicleData } = await supabase
        .from('client_vehicles')
        .select('*, client:clients(*)')
        .eq('organization_id', orgId);
      if (vehicleData) setClientVehicles(vehicleData as ClientVehicle[]);

      // 4. Mechanics for this organization
      const { data: staffData } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', orgId)
        .in('role', ['mechanic', 'admin']);
      if (staffData && staffData.length > 0) {
        setMechanics(staffData as Profile[]);
        // Set default mechanic
        const defaultMech = staffData.find((s) => s.role === 'mechanic') || staffData[0];
        if (defaultMech) setSelectedMechanic(defaultMech as Profile);
      } else {
        setMechanics([]);
        setSelectedMechanic(null);
      }
    } catch (err) {
      console.error('Error fetching POS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  // Handle preloaded vehicle info from vehicle catalog search
  useEffect(() => {
    if (preloadedVehicleInfo && products.length > 0) {
      // Auto-suggest products matching viscosity
      const matchingOil = products.find(
        (p) => p.category === 'Aceite de Motor' && p.viscosity && preloadedVehicleInfo.oil_viscosity?.includes(p.viscosity)
      );
      if (matchingOil) {
        handleAddToCart(matchingOil);
      }
    }
  }, [preloadedVehicleInfo, products]);

  // Categories
  const categories = [
    'Todos',
    'Aceite de Motor',
    'Filtro de Aceite',
    'Filtro de Aire',
    'Líquido de Frenos',
    'Refrigerante',
    'Servicio Mano de Obra'
  ];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.viscosity && p.viscosity.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddToCart = (product: Product, presentation?: ProductPresentation) => {
    // If product has multiple presentations and none was selected, open presentation chooser modal
    if (!presentation && product.presentations && product.presentations.length > 1) {
      setActiveProductForPresentation(product);
      return;
    }

    const pres = presentation || (product.presentations && product.presentations[0]);
    const price = pres ? Number(pres.price) : Number(product.selling_price_base);
    const factor = pres ? Number(pres.factor_liters) : 1;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.presentation?.id === pres?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: Number((newQty * price).toFixed(2)),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            presentation: pres,
            quantity: 1,
            unitPrice: price,
            factorDeducted: factor,
            subtotal: price,
          },
        ];
      }
    });

    setActiveProductForPresentation(null);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index] = {
        ...item,
        quantity: newQty,
        subtotal: Number((newQty * item.unitPrice).toFixed(2)),
      };
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const taxPct = Number(organization?.tax_percentage ?? 15);
  const taxName = organization?.tax_name || 'IVA';
  const currencyCode = organization?.currency || 'USD';
  const prefix = organization?.invoice_prefix || 'FAC';

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Number((subtotal * (taxPct / 100)).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  // Mechanic commission
  const commissionRate = selectedMechanic ? Number(selectedMechanic.commission_percentage || 0) : 0;
  const mechanicCommission = Number(((subtotal * commissionRate) / 100).toFixed(2));

  // Process and save sale directly to Supabase
  const handleProcessSale = async () => {
    if (cart.length === 0) return;
    setProcessingSale(true);

    try {
      const invoiceNumber = `${prefix}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10000 + Math.random() * 90000)}`;

      // 1. Insert into public.sales
      const { data: saleData, error: saleErr } = await supabase
        .from('sales')
        .insert({
          organization_id: orgId,
          invoice_number: invoiceNumber,
          client_id: selectedClient?.id || null,
          vehicle_id: selectedVehicle?.id || null,
          cashier_id: profile?.id || null,
          mechanic_id: selectedMechanic?.id || null,
          payment_method: paymentMethod,
          subtotal: subtotal,
          tax: tax,
          total: total,
          mechanic_commission_amount: mechanicCommission,
          status: 'completed',
        })
        .select()
        .single();

      if (saleErr) throw saleErr;

      // 2. Insert items into public.sale_items (triggers automatic stock deduction!)
      const saleItemsToInsert = cart.map((item) => ({
        sale_id: saleData.id,
        organization_id: orgId,
        product_id: item.product.id,
        presentation_id: item.presentation?.id || null,
        description: `${item.product.name}${item.presentation ? ` (${item.presentation.name})` : ''}`,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        factor_deducted: item.factorDeducted,
        subtotal: item.subtotal,
      }));

      const { error: itemsErr } = await supabase.from('sale_items').insert(saleItemsToInsert);
      if (itemsErr) console.error('Error inserting items:', itemsErr);

      // 3. If vehicle & mileage provided, register in service_history for CRM WhatsApp reminders
      if (selectedVehicle && currentMileageInput) {
        const km = parseFloat(currentMileageInput);
        const nextKm = km + 5000;
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 6); // 6 months

        await supabase.from('service_history').insert({
          organization_id: orgId,
          client_id: selectedClient?.id || selectedVehicle.client_id,
          vehicle_id: selectedVehicle.id,
          sale_id: saleData.id,
          current_mileage: km,
          next_change_mileage: nextKm,
          next_change_date: nextDate.toISOString().split('T')[0],
          oil_used: cart.find((c) => c.product.category === 'Aceite de Motor')?.product.name || 'Servicio de Lubricación',
          mechanic_id: selectedMechanic?.id || null,
          status: 'scheduled',
        });
      }

      // Success animation
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#3B82F6', '#10B981']
      });

      // Prepare receipt data
      const completed: Sale = {
        ...saleData,
        items: saleItemsToInsert as any,
        client: selectedClient || undefined,
        vehicle: selectedVehicle || undefined,
        mechanic: selectedMechanic || undefined,
      };

      setCompletedSale(completed);
      setIsReceiptOpen(true);

      // Clear cart
      setCart([]);
      setSelectedClient(null);
      setSelectedVehicle(null);
      setCurrentMileageInput('');

      // Refresh product stock
      fetchData();
    } catch (err: any) {
      alert(`Error al registrar la venta: ${err.message || 'Error en Supabase'}`);
    } finally {
      setProcessingSale(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-2 sm:p-4 pb-20 lg:pb-4 max-w-[1700px] mx-auto">
      {/* LEFT COLUMN: Products Catalog & Search */}
      <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 overflow-hidden">
        {/* Search & Barcode Header */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, viscosidad (5W-30), marca o código..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const randomItem = products[Math.floor(Math.random() * products.length)];
                if (randomItem) handleAddToCart(randomItem);
              }}
              title="Escanear Código de Barras Rápido"
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
            >
              <Barcode className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Escanear</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-36 bg-slate-800/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-2 text-slate-600" />
              <p className="text-sm">No se encontraron productos coincidentes</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const isOil = p.category === 'Aceite de Motor';
                const isLowStock = Number(p.stock_base) <= Number(p.min_stock_alert);

                return (
                  <div
                    key={p.id}
                    onClick={() => handleAddToCart(p)}
                    className="group relative bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 hover:border-amber-500/50 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    {/* Top badging */}
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 uppercase tracking-wider">
                        {p.brand}
                      </span>
                      {p.viscosity && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {p.viscosity}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-xs font-semibold text-white line-clamp-2 leading-tight mb-2 group-hover:text-amber-400 transition">
                      {p.name}
                    </h4>

                    {/* Stock & Unit */}
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mb-2">
                      <span className={`flex items-center gap-1 ${isLowStock ? 'text-rose-400 font-semibold' : ''}`}>
                        Stock: {Number(p.stock_base).toFixed(1)} {p.base_unit === 'Litro' ? 'L' : 'u'}
                        {isLowStock && <AlertCircle className="w-3 h-3 text-rose-400 inline" />}
                      </span>
                      {isOil && (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1 rounded">
                          {(Number(p.stock_base) / 208).toFixed(1)} Tamb.
                        </span>
                      )}
                    </div>

                    {/* Price and Add button */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                      <div>
                        <span className="text-xs text-slate-400">$</span>
                        <span className="text-sm font-black text-amber-400">
                          {Number(p.selling_price_base).toFixed(2)}
                        </span>
                        <span className="text-[9px] text-slate-400 ml-0.5">/{p.base_unit}</span>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 group-hover:bg-amber-500 border border-amber-500/30 group-hover:border-amber-500 text-amber-400 group-hover:text-black flex items-center justify-center transition">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: POS Cart & Checkout */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Ticket de Venta</h3>
              <p className="text-[10px] text-slate-400">{cart.length} ítems cargados</p>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

        {/* Client & Vehicle Quick Selector */}
        <div className="py-2.5 border-b border-slate-800 space-y-2">
          <div className="flex gap-2">
            {/* Client selector */}
            <div className="flex-1 relative">
              <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedClient?.id || ''}
                onChange={(e) => {
                  const cl = clients.find((c) => c.id === e.target.value) || null;
                  setSelectedClient(cl);
                  if (cl) {
                    const matchVeh = clientVehicles.find((v) => v.client_id === cl.id);
                    if (matchVeh) setSelectedVehicle(matchVeh);
                  }
                }}
                className="w-full pl-8 pr-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Consumidor Final (Sin RUC)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle selector */}
            <div className="flex-1 relative">
              <Car className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedVehicle?.id || ''}
                onChange={(e) => {
                  const vh = clientVehicles.find((v) => v.id === e.target.value) || null;
                  setSelectedVehicle(vh);
                  if (vh) setCurrentMileageInput(String(vh.current_mileage || ''));
                }}
                className="w-full pl-8 pr-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Sin Vehículo</option>
                {clientVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} - {v.brand} {v.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedVehicle && (
            <div className="flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50 text-xs">
              <span className="text-slate-400 text-[11px]">Kilometraje actual:</span>
              <input
                type="number"
                value={currentMileageInput}
                onChange={(e) => setCurrentMileageInput(e.target.value)}
                placeholder="Ej. 52400"
                className="flex-1 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
              <span className="text-slate-500 text-[10px]">km</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2 min-h-[160px] max-h-[300px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-8">
              <ShoppingCart className="w-8 h-8 stroke-1 text-slate-600 mb-2" />
              <p className="text-xs">El carrito está vacío</p>
              <p className="text-[10px] text-slate-600">Toca un producto para agregarlo</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-white truncate">{item.product.name}</h5>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                    {item.presentation && (
                      <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-medium">
                        {item.presentation.name}
                      </span>
                    )}
                    <span>${item.unitPrice.toFixed(2)} c/u</span>
                  </div>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(idx, -1)}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center text-xs transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-mono font-bold text-xs text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(idx, 1)}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center text-xs transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right pl-2">
                  <span className="font-mono font-bold text-xs text-amber-400">
                    ${item.subtotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="block text-slate-500 hover:text-rose-400 ml-auto mt-0.5 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mechanic & Commission Section */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-blue-400" />
              Mecánico:
            </span>
            <select
              value={selectedMechanic?.id || ''}
              onChange={(e) => {
                const m = mechanics.find((mech) => mech.id === e.target.value) || null;
                setSelectedMechanic(m);
              }}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
            >
              {mechanics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.commission_percentage}%)
                </option>
              ))}
            </select>
          </div>

          {selectedMechanic && (
            <div className="flex justify-between text-[11px] text-blue-400 bg-blue-950/40 px-2 py-1 rounded border border-blue-900/50">
              <span>Comisión de {selectedMechanic.full_name.split(' ')[0]}:</span>
              <span className="font-bold">${mechanicCommission.toFixed(2)}</span>
            </div>
          )}

          {/* Payment Methods */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { id: 'cash', label: 'Efectivo', icon: Banknote },
              { id: 'card', label: 'Tarjeta', icon: CreditCard },
              { id: 'transfer', label: 'Transf.', icon: Smartphone },
              { id: 'credit', label: 'Crédito', icon: CheckCircle },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`py-1.5 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 border transition ${
                    paymentMethod === p.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1 text-xs pt-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal, currencyCode)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{taxName} ({taxPct}%):</span>
              <span>{formatCurrency(tax, currencyCode)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-slate-800">
              <span>TOTAL A COBRAR:</span>
              <span className="text-amber-400 font-black">{formatCurrency(total, currencyCode)}</span>
            </div>
          </div>

          {/* Process Sale Button */}
          <button
            onClick={handleProcessSale}
            disabled={cart.length === 0 || processingSale}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {processingSale ? (
              <span>Registrando en Supabase...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Cobrar {formatCurrency(total, currencyCode)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Presentation Chooser Modal */}
      {activeProductForPresentation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-white text-base mb-1">{activeProductForPresentation.name}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Selecciona la presentación de venta para este lubricante:
            </p>

            <div className="space-y-2 mb-5">
              {activeProductForPresentation.presentations?.map((pres) => (
                <button
                  key={pres.id}
                  onClick={() => handleAddToCart(activeProductForPresentation, pres)}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-500 text-left flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white text-sm block group-hover:text-amber-400 transition">
                        {pres.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Equivale a {pres.factor_liters} Litro(s) de stock base
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-amber-400 font-mono">
                      ${Number(pres.price).toFixed(2)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveProductForPresentation(null)}
              className="w-full py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Completed Sale Receipt Modal */}
      <ReceiptModal
        sale={completedSale}
        org={organization}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
