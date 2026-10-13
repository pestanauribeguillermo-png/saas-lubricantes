import React, { useState, useEffect } from 'react';
import { supabase, DEFAULT_ORG_ID } from '../../lib/supabase';
import { Product, ProductCategory, ProductPresentation } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingDown,
  Layers,
  Edit2,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Fuel,
  X
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { organization } = useAuth();
  const orgId = organization?.id || DEFAULT_ORG_ID;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  // Quick stock edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<string>('');

  // New product modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: '',
    category: 'Aceite de Motor' as ProductCategory,
    base_unit: 'Litro',
    stock_base: 208,
    min_stock_alert: 30,
    cost_price: 6.5,
    selling_price_base: 11.0,
    viscosity: '5W-30',
    api_rating: 'API SP / ILSAC GF-6',
  });

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        presentations:product_presentations(*)
      `)
      .eq('organization_id', orgId)
      .order('name');

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, [orgId]);

  const handleUpdateStock = async (productId: string, currentVal: number) => {
    const val = parseFloat(newStockVal);
    if (isNaN(val)) return;

    const { error } = await supabase
      .from('products')
      .update({ stock_base: val, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock_base: val } : p))
      );
      setEditingStockId(null);
    } else {
      alert('Error al actualizar stock: ' + error.message);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: newProd, error: prodErr } = await supabase
        .from('products')
        .insert({
          organization_id: orgId,
          code: formData.code,
          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          base_unit: formData.base_unit,
          stock_base: Number(formData.stock_base),
          min_stock_alert: Number(formData.min_stock_alert),
          cost_price: Number(formData.cost_price),
          selling_price_base: Number(formData.selling_price_base),
          viscosity: formData.category === 'Aceite de Motor' ? formData.viscosity : null,
          api_rating: formData.category === 'Aceite de Motor' ? formData.api_rating : null,
        })
        .select()
        .single();

      if (prodErr) throw prodErr;

      // If it's motor oil, automatically create standard presentations (Tambor, Galón, Cuarto, Litro)
      if (formData.category === 'Aceite de Motor' && newProd) {
        const pres = [
          {
            product_id: newProd.id,
            organization_id: orgId,
            name: 'Litro suelto (1L)',
            factor_liters: 1.0,
            price: Number(formData.selling_price_base),
            is_default: false,
          },
          {
            product_id: newProd.id,
            organization_id: orgId,
            name: 'Cuarto (0.946L / 1 Qt)',
            factor_liters: 0.946,
            price: Number((formData.selling_price_base * 1.05).toFixed(2)),
            is_default: true,
          },
          {
            product_id: newProd.id,
            organization_id: orgId,
            name: 'Galón (3.785L / 1 Gal)',
            factor_liters: 3.785,
            price: Number((formData.selling_price_base * 3.785 * 0.95).toFixed(2)),
            is_default: false,
          },
          {
            product_id: newProd.id,
            organization_id: orgId,
            name: 'Tambor (208L)',
            factor_liters: 208.0,
            price: Number((formData.selling_price_base * 208 * 0.88).toFixed(2)),
            is_default: false,
          },
        ];
        await supabase.from('product_presentations').insert(pres);
      }

      setIsCreateModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      alert('Error creando producto: ' + err.message);
    }
  };

  const categories = [
    'Todos',
    'Aceite de Motor',
    'Filtro de Aceite',
    'Filtro de Aire',
    'Líquido de Frenos',
    'Refrigerante',
    'Servicio Mano de Obra',
  ];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      (p.viscosity && p.viscosity.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  // Global Inventory Metrics
  const totalLitersInStock = products
    .filter((p) => p.category === 'Aceite de Motor')
    .reduce((sum, p) => sum + Number(p.stock_base), 0);

  const lowStockCount = products.filter(
    (p) => Number(p.stock_base) <= Number(p.min_stock_alert)
  ).length;

  const totalInventoryValuation = products.reduce(
    (sum, p) => sum + Number(p.stock_base) * Number(p.cost_price),
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 pb-20 lg:pb-8">
      {/* Top Banner and KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Volumen total en tambores */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Aceite en Stock Base</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {totalLitersInStock.toFixed(1)} L
              </span>
              <span className="text-xs text-slate-400">
                ({(totalLitersInStock / 208).toFixed(1)} Tambores)
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Fuel className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Alertas de Stock Mínimo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Alertas Stock Crítico</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-black font-mono ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {lowStockCount} ítems
              </span>
              <span className="text-xs text-slate-400">por reponer</span>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Valoración Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Valoración de Bodega (Costo)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-blue-400 font-mono">
                ${totalInventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Bar & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, nombre, marca o viscosidad..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Inventory & Equivalences Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/80 text-slate-300 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3.5">Código / Producto</th>
                <th className="p-3.5">Categoría & Viscosidad</th>
                <th className="p-3.5">Stock Base</th>
                <th className="p-3.5">Equivalencias de Venta</th>
                <th className="p-3.5 text-right">Precio Venta (Base)</th>
                <th className="p-3.5 text-center">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Cargando inventario desde Supabase...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No se encontraron productos coincidentes.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOil = p.category === 'Aceite de Motor';
                  const isLow = Number(p.stock_base) <= Number(p.min_stock_alert);

                  // Volume breakdown
                  const liters = Number(p.stock_base);
                  const barrels = (liters / 208).toFixed(1);
                  const gallons = (liters / 3.785).toFixed(1);
                  const quarts = (liters / 0.946).toFixed(1);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-xs sm:text-sm">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="font-mono text-slate-500">{p.code}</span>
                          <span>•</span>
                          <span className="text-amber-400/90 font-medium">{p.brand}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                          {p.category}
                        </span>
                        {p.viscosity && (
                          <span className="inline-block ml-1.5 px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-[11px] font-bold">
                            {p.viscosity}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {editingStockId === p.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={newStockVal}
                              onChange={(e) => setNewStockVal(e.target.value)}
                              className="w-20 px-2 py-1 bg-slate-800 border border-amber-500 rounded text-xs text-white font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateStock(p.id, Number(p.stock_base))}
                              className="p-1 bg-amber-500 hover:bg-amber-400 text-black rounded"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="p-1 bg-slate-700 text-white rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-mono font-bold text-sm ${isLow ? 'text-rose-400' : 'text-white'}`}>
                                {liters.toFixed(1)} {p.base_unit === 'Litro' ? 'L' : 'u'}
                              </span>
                              {isLow && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold uppercase tracking-wider">
                                  Bajo
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              Mínimo: {p.min_stock_alert} {p.base_unit === 'Litro' ? 'L' : 'u'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Equivalences Breakdown */}
                      <td className="p-3.5">
                        {isOil ? (
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-900/50 text-blue-300 font-mono">
                              🛢️ {barrels} Tambores (208L)
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-900/50 text-emerald-300 font-mono">
                              🧴 {gallons} Galones (3.785L)
                            </span>
                            <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-900/50 text-purple-300 font-mono">
                              📦 {quarts} Cuartos (0.946L)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Unidad estándar</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-amber-400">
                        ${Number(p.selling_price_base).toFixed(2)}
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            setEditingStockId(p.id);
                            setNewStockVal(String(p.stock_base));
                          }}
                          title="Ajustar Stock"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition inline-block"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
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

      {/* New Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Registrar Nuevo Producto / Lubricante</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Código / SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ej. CAS-5W30-MG"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej. Castrol, Mobil, Motul"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Castrol Edge 5W-30 Titanium FST"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Aceite de Motor">Aceite de Motor</option>
                    <option value="Filtro de Aceite">Filtro de Aceite</option>
                    <option value="Filtro de Aire">Filtro de Aire</option>
                    <option value="Líquido de Frenos">Líquido de Frenos</option>
                    <option value="Refrigerante">Refrigerante</option>
                    <option value="Servicio Mano de Obra">Servicio Mano de Obra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Viscosidad</label>
                  <input
                    type="text"
                    value={formData.viscosity}
                    onChange={(e) => setFormData({ ...formData, viscosity: e.target.value })}
                    placeholder="Ej. 5W-30, 0W-20, 10W-40"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Stock Inicial (Litros o Unidades)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.stock_base}
                    onChange={(e) => setFormData({ ...formData, stock_base: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Alerta Stock Mínimo</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.min_stock_alert}
                    onChange={(e) => setFormData({ ...formData, min_stock_alert: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Costo Unitario ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Precio Venta Base ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.selling_price_base}
                    onChange={(e) => setFormData({ ...formData, selling_price_base: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition"
              >
                Guardar Producto y Generar Equivalencias
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
