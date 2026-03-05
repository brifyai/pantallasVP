import React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  Car, 
  TrendingUp, 
  Users, 
  Crosshair 
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { recentDetections, SCREENS, BRANDS, PREMIUM_BRANDS } from '../data/mockData';
import { cn } from '../utils/cn';

// Setup default Leaflet icons fix is usually needed, but since we use CircleMarker, we don't strictly need the image fix.

export function BrandIntelligence() {
  const [selectedBrand, setSelectedBrand] = useState<string>('BMW');
  const [searchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position when opening
  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
  };

  // Update position when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition, true);
    }
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derived metrics for the selected brand
  const brandData = useMemo(() => {
    return recentDetections.filter(d => d.vehicle.brand === selectedBrand);
  }, [selectedBrand]);

  const kpis = useMemo(() => {
    const total = brandData.length;
    
    // Top screen
    const screenCounts = brandData.reduce((acc, curr) => {
      acc[curr.screenCommune] = (acc[curr.screenCommune] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topScreen = Object.entries(screenCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Peak hour
    const hourCounts = brandData.reduce((acc, curr) => {
      const h = new Date(curr.timestamp).getHours();
      acc[h] = (acc[h] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const peakHourEntry = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    const peakHour = peakHourEntry ? `${String(peakHourEntry[0]).padStart(2, '0')}:00` : 'N/A';

    // Affinity (Mock: just pick another brand from the same premium/regular tier)
    const isPremium = PREMIUM_BRANDS.includes(selectedBrand);
    const pool = isPremium ? PREMIUM_BRANDS : BRANDS.filter(b => !PREMIUM_BRANDS.includes(b));
    const affinity = pool.filter(b => b !== selectedBrand)[0] || BRANDS[0];

    return { total, topScreen, peakHour, affinity };
  }, [brandData, selectedBrand]);

  // Hourly Flow Chart Data
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const h = new Date().getHours() - (23 - i);
      return h < 0 ? h + 24 : h;
    });
    
    return hours.map(h => {
      const count = brandData.filter(d => new Date(d.timestamp).getHours() === h).length;
      return {
        hour: `${String(h).padStart(2, '0')}:00`,
        vehiculos: count
      };
    });
  }, [brandData]);

  // Year Distribution
  const yearData = useMemo(() => {
    const counts = brandData.reduce((acc, curr) => {
      const bucket = curr.vehicle.year >= 2020 ? '2020+' :
                     curr.vehicle.year >= 2015 ? '2015-2019' :
                     curr.vehicle.year >= 2010 ? '2010-2014' : 'Pre-2010';
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [brandData]);

  // Map Data
  const mapData = useMemo(() => {
    return SCREENS.map(screen => {
      const count = brandData.filter(d => d.screenId === screen.id).length;
      return {
        ...screen,
        count,
        radius: Math.max(count * 0.5, 3) // Scale for circle radius (smaller)
      };
    }).filter(s => s.count > 0);
  }, [brandData]);

  // Filtered brands for search
  const filteredBrands = BRANDS.filter(b => b.toLowerCase().includes(searchTerm.toLowerCase()));

  const COLORS = ['#00e5ff', '#ff00e5', '#00ff88', '#facc15'];

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-navy-900/50 backdrop-blur-md p-6 rounded-xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Brand Intelligence</h2>
          <p className="text-slate-400 text-sm">Análisis profundo de comportamiento, rutas y afinidad por marca.</p>
        </div>
      </div>

      {/* Dropdown - outside the blur container to avoid stacking context issues */}
      <div className="w-full md:w-72 -mt-2">
        <label className="block text-sm font-medium text-gray-400 mb-2">Seleccionar Marca</label>
        <div className="relative" ref={dropdownRef}>
          {/* Custom Dropdown Button */}
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-[rgba(20,25,40,0.7)] backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white cursor-pointer flex items-center justify-between transition-all hover:border-cyan-500/50"
          >
            <span>{selectedBrand}</span>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
          
          {/* Dropdown Options - Using Portal to escape stacking context */}
          {isDropdownOpen && createPortal(
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: '300px',
                overflowY: 'auto',
                backgroundColor: 'rgba(20, 25, 40, 0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                zIndex: 99999,
              }}
            >
              {filteredBrands.map((brand) => (
                <div
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedBrand === brand
                      ? 'linear-gradient(135deg, #06b6d4, #ec4899)'
                      : 'transparent',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBrand !== brand) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBrand !== brand) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {brand}
                </div>
              ))}
            </motion.div>,
            document.body
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIBox title="Detecciones (24h)" value={kpis.total.toLocaleString()} icon={Car} color="text-cyan-400" />
        <KPIBox title="Pantalla Principal" value={kpis.topScreen} icon={MapPin} color="text-magenta-400" />
        <KPIBox title="Hora Peak" value={kpis.peakHour} icon={Clock} color="text-lime-400" />
        <KPIBox title="Alta Afinidad" value={kpis.affinity} icon={Crosshair} color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Flujo Horario */}
        <div className="lg:col-span-2 bg-navy-900/50 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Flujo de {selectedBrand} por Hora
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#00e5ff', fontWeight: 500 }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="vehiculos" stroke="#00e5ff" strokeWidth={2} fillOpacity={1} fill="url(#colorBrand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por Año */}
        <div className="bg-navy-900/50 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-magenta-400" />
            Antigüedad del Parque
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={yearData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {yearData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
                  labelStyle={{ color: '#00e5ff', fontWeight: 600, marginBottom: '4px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {yearData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Layer sobre Map */}
      <div className="bg-navy-900/50 backdrop-blur-md p-6 rounded-xl border border-white/10 h-[500px] flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-lime-400" />
          Heatmap Geográfico: Detecciones de {selectedBrand}
        </h3>
        <div className="flex-1 rounded-xl overflow-hidden relative z-0">
          <MapContainer 
            center={[-33.4489, -70.6693]} 
            zoom={11} 
            scrollWheelZoom={false} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {mapData.map((screen) => (
              <CircleMarker
                key={screen.id}
                center={[screen.lat, screen.lng]}
                radius={screen.radius}
                fillColor={PREMIUM_BRANDS.includes(selectedBrand) ? "#ff00e5" : "#00e5ff"}
                color={PREMIUM_BRANDS.includes(selectedBrand) ? "#ff00e5" : "#00e5ff"}
                weight={1}
                opacity={0.8}
                fillOpacity={0.4}
              >
                <Popup className="custom-popup">
                  <div className="text-[#0a0a1a] p-1">
                    <p className="font-bold text-sm mb-1">{screen.name}</p>
                    <p className="text-xs">Detecciones {selectedBrand}: <b>{screen.count}</b></p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

    </div>
  );
}

function KPIBox({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-navy-900/50 backdrop-blur-md p-5 rounded-xl border border-white/10 flex items-center gap-4"
    >
      <div className={cn("p-3 rounded-xl bg-white/5", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </motion.div>
  );
}
