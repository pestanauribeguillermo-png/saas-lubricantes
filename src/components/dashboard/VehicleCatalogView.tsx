import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { VehicleCatalog } from '../../types/database';
import {
  Car,
  Search,
  Droplet,
  Layers,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface VehicleCatalogViewProps {
  onSelectForPOS?: (vehicle: VehicleCatalog) => void;
}

export const VehicleCatalogView: React.FC<VehicleCatalogViewProps> = ({ onSelectForPOS }) => {
  const [catalog, setCatalog] = useState<VehicleCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  // Cascading Selectors
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCatalog | null>(null);

  // Quick text search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles_catalog')
        .select('*')
        .order('brand');

      if (!error && data) {
        setCatalog(data as VehicleCatalog[]);
        // Auto select first vehicle for preview
        if (data.length > 0) {
          setSelectedBrand(data[0].brand);
          setSelectedModel(data[0].model);
          setSelectedVehicle(data[0] as VehicleCatalog);
        }
      }
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  // Distinct Brands
  const brands = Array.from(new Set(catalog.map((v) => v.brand))).sort();

  // Distinct Models for selected brand
  const models = Array.from(
    new Set(catalog.filter((v) => !selectedBrand || v.brand === selectedBrand).map((v) => v.model))
  ).sort();

  // Engine variations for selected brand & model
  const engines = catalog.filter(
    (v) => (!selectedBrand || v.brand === selectedBrand) && (!selectedModel || v.model === selectedModel)
  );

  // Quick search results
  const searchResults = searchTerm.trim()
    ? catalog.filter(
        (v) =>
          v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.engine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.oil_viscosity.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectFromSearch = (v: VehicleCatalog) => {
    setSelectedBrand(v.brand);
    setSelectedModel(v.model);
    setSelectedVehicle(v);
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Catálogo Técnico de Lubricación y Filtros</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Base de datos de viscosidades OEM, capacidad de cárter en litros y códigos exactos de filtros.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por auto (ej. Hilux, Aveo, 5W-30)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />

          {/* Quick search dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 max-h-60 overflow-y-auto">
              {searchResults.map((res) => (
                <button
                  key={res.id}
                  onClick={() => handleSelectFromSearch(res)}
                  className="w-full text-left p-2.5 hover:bg-slate-800 border-b border-slate-800/80 text-xs text-white flex justify-between items-center transition"
                >
                  <div>
                    <span className="font-bold text-amber-400">{res.brand} {res.model}</span>
                    <span className="text-slate-400 block text-[10px]">{res.engine} ({res.year_start}-{res.year_end || 'Presente'})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px]">
                    {res.oil_viscosity}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Cascade Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Brand */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            1. Marca del Vehículo
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              const brand = e.target.value;
              setSelectedBrand(brand);
              const brandModels = catalog.filter((v) => v.brand === brand);
              if (brandModels.length > 0) {
                setSelectedModel(brandModels[0].model);
                setSelectedVehicle(brandModels[0]);
              }
            }}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-medium focus:outline-none focus:border-amber-500"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Model */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            2. Modelo
          </label>
          <select
            value={selectedModel}
            onChange={(e) => {
              const model = e.target.value;
              setSelectedModel(model);
              const match = catalog.find((v) => v.brand === selectedBrand && v.model === model);
              if (match) setSelectedVehicle(match);
            }}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-medium focus:outline-none focus:border-amber-500"
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Engine & Year */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            3. Motor y Generación
          </label>
          <select
            value={selectedVehicle?.id || ''}
            onChange={(e) => {
              const vh = catalog.find((v) => v.id === e.target.value);
              if (vh) setSelectedVehicle(vh);
            }}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-medium focus:outline-none focus:border-amber-500"
          >
            {engines.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.engine} ({eng.year_start} - {eng.year_end || 'Actual'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Technical Spec Sheet Card */}
      {selectedVehicle && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle glow border */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Title and Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider border border-amber-500/30">
                  {selectedVehicle.brand}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Años: {selectedVehicle.year_start} - {selectedVehicle.year_end || 'Presente'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {selectedVehicle.model} <span className="text-slate-400 font-normal text-lg">({selectedVehicle.engine})</span>
              </h2>
            </div>

            {onSelectForPOS && (
              <button
                onClick={() => onSelectForPOS(selectedVehicle)}
                className="py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition group"
              >
                <span>Cargar en el POS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            )}
          </div>

          {/* Grid of Key Technical Lubrication Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            {/* 1. Viscosidad */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase">Viscosidad Recomendada</span>
                <Droplet className="w-4 h-4 text-amber-400" />
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {selectedVehicle.oil_viscosity}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Tipo: <strong className="text-slate-200">{selectedVehicle.oil_type}</strong>
              </span>
            </div>

            {/* 2. Capacidad de Cárter */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase">Capacidad de Cárter</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                  {selectedVehicle.crankcase_capacity_liters} L
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Aprox: <strong className="text-slate-200">{(selectedVehicle.crankcase_capacity_liters / 0.946).toFixed(1)} Cuartos (Qt)</strong>
              </span>
            </div>

            {/* 3. Filtro de Aceite */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase">Filtro de Aceite (OEM/Aftermarket)</span>
                <Wrench className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="my-1">
                <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono break-words">
                  {selectedVehicle.filter_oil_code || 'Consultar manual'}
                </span>
              </div>
              <span className="text-[11px] text-emerald-300/80 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline" /> Reemplazo en cada servicio
              </span>
            </div>

            {/* 4. Filtro de Aire */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase">Filtro de Aire Motor</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="my-1">
                <span className="text-sm sm:text-base font-bold text-purple-400 font-mono break-words">
                  {selectedVehicle.filter_air_code || 'Estándar'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Cabina: <strong className="text-slate-300 font-mono">{selectedVehicle.filter_cabin_code || 'Tanque'}</strong>
              </span>
            </div>
          </div>

          {/* Notes and Recommendations Box */}
          {selectedVehicle.notes && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs sm:text-sm text-amber-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-200 mb-0.5">Nota Técnica del Fabricante:</strong>
                <p className="text-slate-300">{selectedVehicle.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid of Other Quick Popular Vehicles */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Vehículos Más Frecuentes en el Taller
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {catalog.slice(0, 12).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedBrand(item.brand);
                setSelectedModel(item.model);
                setSelectedVehicle(item);
              }}
              className={`p-2.5 rounded-xl border text-left transition ${
                selectedVehicle?.id === item.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-800/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-500 block uppercase">{item.brand}</span>
              <span className="text-xs font-bold block truncate">{item.model}</span>
              <span className="text-[10px] font-mono text-amber-400 font-semibold">{item.oil_viscosity}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
