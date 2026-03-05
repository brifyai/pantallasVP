import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Layers, 
  Activity, 
  Navigation, 
  ShieldAlert,
  Filter
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, Polyline, Popup, CircleMarker, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Declaración de tipos para leaflet.heat
declare module 'leaflet' {
  interface LayerGroup {
    setLatLngs(latlngs: L.LatLngExpression[]): this;
  }
  function heatLayer(latlngs: L.LatLngExpression[], options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    gradient?: Record<number, string>;
  }): L.LayerGroup;
}

import { SCREENS, recentDetections, BRANDS } from '../data/mockData';
import { cn } from '../utils/cn';
import { HeatmapLayer } from '../components/HeatmapLayer';

// Puntos de "Huecos" (Gaps in coverage) - Mocked
const GAPS = [
  { id: 'gap-1', name: 'Quilicura Norte', lat: -33.34, lng: -70.73, reason: 'Alto tráfico industrial, 0% cobertura' },
  { id: 'gap-2', name: 'Pudahuel Sur / Ruta 68', lat: -33.48, lng: -70.79, reason: 'Cruce estratégico sin pantallas' },
  { id: 'gap-3', name: 'Peñalolén Alto', lat: -33.49, lng: -70.52, reason: 'Segmento AB de alto crecimiento' }
];

// Comunas de Origen para rutas inferidas
const ORIGINS = [
  { name: 'Maipú', lat: -33.51, lng: -70.75 },
  { name: 'Puente Alto', lat: -33.61, lng: -70.57 },
  { name: 'Las Condes', lat: -33.41, lng: -70.58 },
  { name: 'Santiago Centro', lat: -33.45, lng: -70.65 }
];

// Interface para rutas inferidas
interface InferredRoute {
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  count: number;
  avgDuration?: number;
}

// Comunas data loaded from GeoJSON
interface ComunaData {
  name: string;
  lat: number;
  lng: number;
  polygon: [number, number][];
}

export function GeoIntelligence() {
  const [activeLayers, setActiveLayers] = useState({
    screens: true,
    coverage: false,
    heatmap: false,
    routes: false,
    gaps: true,
    comunas: false,
    comunasLabels: false
  });
  const [comunasData, setComunasData] = useState<ComunaData[]>([]);

  // Load GeoJSON data on mount
  useEffect(() => {
    fetch('/data/comunas-santiago.geojson')
      .then(res => res.json())
      .then(data => {
        const comunas = data.features.map((feature: any) => {
          const coords = feature.geometry.coordinates[0];
          const polygon = coords.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
          const centerLat = coords.reduce((sum: number, c: [number, number]) => sum + c[1], 0) / coords.length;
          const centerLng = coords.reduce((sum: number, c: [number, number]) => sum + c[0], 0) / coords.length;
          return {
            name: feature.properties.name,
            lat: centerLat,
            lng: centerLng,
            polygon
          };
        });
        setComunasData(comunas);
      })
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);
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

  // Calculate stats per screen based on selected brand
  const screenStats = useMemo(() => {
    return SCREENS.map(screen => {
      const screenDetections = recentDetections.filter(d => 
        d.screenId === screen.id && 
        (selectedBrand === 'All' || d.vehicle.brand === selectedBrand)
      );
      
      const volume = screenDetections.length;
      const premiumCount = screenDetections.filter(d => 
        ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Tesla', 'Volvo', 'Lexus'].includes(d.vehicle.brand)
      ).length;
      
      const premiumRatio = volume > 0 ? premiumCount / volume : 0;
      // AdScore: 0 to 100 based on volume + premium ratio
      const score = Math.min(100, (volume / 100) * 60 + (premiumRatio * 40));
      
      let status: 'high' | 'medium' | 'low' = 'low';
      if (score > 70) status = 'high';
      else if (score > 40) status = 'medium';

      return {
        ...screen,
        volume,
        score: Math.round(score),
        status,
        premiumRatio: Math.round(premiumRatio * 100)
      };
    });
  }, [selectedBrand]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Toggle selección de pantalla para filtrar rutas
  const toggleScreenSelection = (screenId: number) => {
    setSelectedScreenId(prev => prev === screenId ? null : screenId);
  };

  // Inferir rutas desde los datos de detección
  const inferredRoutes = useMemo(() => {
    const routes: Map<string, InferredRoute & { vehicles: Set<string>, avgTime: number }> = new Map();
    
    // Buscar vehículos que aparecen en múltiples pantallas
    const vehicleMovements = new Map<string, Array<{ screenId: number; timestamp: Date; brand: string }>>();
    recentDetections.forEach(det => {
      const vehicleKey = `${det.vehicle.brand}-${det.vehicle.year}-${Math.floor(Math.random() * 100)}`;
      const existing = vehicleMovements.get(vehicleKey) || [];
      existing.push({
        screenId: det.screenId,
        timestamp: new Date(det.timestamp),
        brand: det.vehicle.brand
      });
      vehicleMovements.set(vehicleKey, existing);
    });
    
    // Contar rutas entre pantallas
    vehicleMovements.forEach((movements, vehicleKey) => {
      if (movements.length < 2) return;
      
      // Ordenar por timestamp
      movements.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      // Crear rutas entre pantallas consecutivas
      for (let i = 0; i < movements.length - 1; i++) {
        const fromScreen = SCREENS.find(s => s.id === movements[i].screenId);
        const toScreen = SCREENS.find(s => s.id === movements[i + 1].screenId);
        
        if (!fromScreen || !toScreen || fromScreen.id === toScreen.id) continue;
        
        const routeKey = `${fromScreen.id}-${toScreen.id}`;
        const existing = routes.get(routeKey);
        const travelTime = (movements[i + 1].timestamp.getTime() - movements[i].timestamp.getTime()) / 60000; // minutos
        
        if (existing) {
          existing.count++;
          existing.vehicles.add(vehicleKey);
          existing.avgTime = ((existing.avgTime * (existing.count - 1)) + travelTime) / existing.count;
        } else {
          routes.set(routeKey, {
            from: { lat: fromScreen.lat, lng: fromScreen.lng, name: fromScreen.commune },
            to: { lat: toScreen.lat, lng: toScreen.lng, name: toScreen.commune },
            count: 1,
            vehicles: new Set([vehicleKey]),
            avgTime: travelTime
          });
        }
      }
    });
    
    // Filtrar rutas con al menos 3 ocurrencias y convertir a array
    return Array.from(routes.values())
      .filter(r => r.count >= 3)
      .sort((a, b) => b.count - a.count)
      .slice(0, 100); // Limitar a 100 rutas más frecuentes
  }, []);

  // Estadísticas de rutas para el panel
  const routeStats = useMemo(() => {
    if (inferredRoutes.length === 0) return null;
    
    const totalRoutes = inferredRoutes.length;
    const totalVehicles = inferredRoutes.reduce((sum, r) => sum + r.count, 0);
    const topRoute = inferredRoutes[0];
    const avgRoutesPerVehicle = totalRoutes > 0 ? (totalVehicles / totalRoutes).toFixed(1) : 0;
    
    // Agrupar por comuna de origen más frecuente
    const originCounts = inferredRoutes.reduce((acc, r) => {
      acc[r.from.name] = (acc[r.from.name] || 0) + r.count;
      return acc;
    }, {} as Record<string, number>);
    const topOrigin = Object.entries(originCounts).sort((a, b) => b[1] - a[1])[0];
    
    return { totalRoutes, totalVehicles, topRoute, avgRoutesPerVehicle, topOrigin };
  }, [inferredRoutes]);

  // Memoizar puntos del heatmap para evitar recreación constante
  const heatmapPoints = useMemo(() => {
    return screenStats.map(screen => [screen.lat, screen.lng, screen.score / 100] as [number, number, number]);
  }, [screenStats]);

  // Helper to create custom glowing dot markers
  const createDotIcon = (status: 'high' | 'medium' | 'low') => {
    const colors = {
      high: '#00ff88',  // Lime
      medium: '#facc15', // Yellow
      low: '#ef4444'    // Red
    };
    const color = colors[status];
    
    return L.divIcon({
      className: 'custom-dot-icon',
      html: `<div style="
        background-color: ${color};
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });
  };

  const gapIcon = L.divIcon({
    className: 'custom-gap-icon',
    html: `<div style="
      background-color: #ff00e5;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 10px #ff00e5, 0 0 20px #ff00e5;
      animation: pulse 2s infinite;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12]
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 pb-6">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        
        {/* Header/Filters */}
        <div className="bg-navy-900/50 backdrop-blur-md p-5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Geo Intelligence</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Análisis espacial de flujos vehiculares y optimización de redes.
          </p>

          <label className="text-xs text-slate-500 font-medium uppercase mb-2 block">Filtrar por Marca</label>
          <div className="relative mb-6" ref={dropdownRef}>
            {/* Custom Dropdown Button */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[rgba(20,25,40,0.7)] backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white cursor-pointer flex items-center justify-between transition-all hover:border-cyan-500/50"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                {selectedBrand === 'All' ? 'Todas las Marcas' : selectedBrand}
              </span>
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
                <div
                  key="All"
                  onClick={() => {
                    setSelectedBrand('All');
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedBrand === 'All'
                      ? 'linear-gradient(135deg, #06b6d4, #ec4899)'
                      : 'transparent',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBrand !== 'All') {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBrand !== 'All') {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  Todas las Marcas
                </div>
                {BRANDS.sort().map((brand) => (
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

        {/* Layer Controls */}
        <div className="bg-navy-900/50 backdrop-blur-md p-5 rounded-xl border border-white/10 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-magenta-400" />
            Capas del Mapa
          </h3>
          
          {/* Panel de Estadísticas de Rutas (solo cuando está activo) */}
          {activeLayers.routes && routeStats && (
            <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <h4 className="text-xs font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Navigation className="w-3 h-3" />
                Estadísticas de Rutas
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total rutas:</span>
                  <strong className="text-white">{routeStats.totalRoutes}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Movimientos:</span>
                  <strong className="text-white">{routeStats.totalVehicles}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Promedio/ruta:</span>
                  <strong className="text-white">{routeStats.avgRoutesPerVehicle}</strong>
                </div>
                <div className="pt-2 border-t border-cyan-500/30">
                  <span className="text-slate-400 block mb-1">Ruta más frecuente:</span>
                  <span className="text-white font-medium">
                    {routeStats.topRoute?.from.name} → {routeStats.topRoute?.to.name}
                  </span>
                  <span className="text-cyan-400 text-xs block">
                    {routeStats.topRoute?.count} vehículos
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <LayerToggle 
              active={activeLayers.screens} 
              onClick={() => toggleLayer('screens')}
              icon={MapPin}
              label="Pantallas Activas" 
              color="text-lime-400"
            />
            <LayerToggle 
              active={activeLayers.comunas} 
              onClick={() => toggleLayer('comunas')}
              icon={Layers}
              label="Límites de Comunas" 
              color="text-purple-400"
            />
            <LayerToggle 
              active={activeLayers.comunasLabels} 
              onClick={() => toggleLayer('comunasLabels')}
              icon={MapPin}
              label="Nombres de Comunas" 
              color="text-purple-300"
            />
            <LayerToggle 
              active={activeLayers.coverage} 
              onClick={() => toggleLayer('coverage')}
              icon={Activity}
              label="Zonas de Cobertura (2.5km)" 
              color="text-cyan-400"
            />
            <LayerToggle 
              active={activeLayers.heatmap} 
              onClick={() => toggleLayer('heatmap')}
              icon={Layers}
              label="Capa de Calor (Volumen)" 
              color="text-orange-400"
            />
            <LayerToggle 
              active={activeLayers.routes} 
              onClick={() => toggleLayer('routes')}
              icon={Navigation}
              label="Rutas Inferidas" 
              color="text-blue-400"
            />
            <LayerToggle 
              active={activeLayers.gaps} 
              onClick={() => toggleLayer('gaps')}
              icon={ShieldAlert}
              label="Huecos de Red (Oportunidades)" 
              color="text-magenta-400"
            />
          </div>

          {/* Leyenda */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase">Leyenda de Pantallas</h4>
            <div className="space-y-2">
              <LegendItem color="#00ff88" label="Alto Valor (>70 Score)" />
              <LegendItem color="#facc15" label="Valor Medio (40-70 Score)" />
              <LegendItem color="#ef4444" label="Bajo Valor (<40 Score)" />
            </div>
          </div>
          
          {/* Leyenda de Rutas (solo cuando está activo) */}
          {activeLayers.routes && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase">Leyenda de Rutas</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-cyan-400" style={{ boxShadow: "0 0 8px #00e5ff" }}></div>
                  <span className="text-xs text-slate-300">Ruta inferida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-slate-300">Origen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-xs text-slate-300">Destino</span>
                </div>
                <p className="text-xs text-slate-500 mt-3 italic">
                  💡 Haz clic en una pantalla para ver solo sus rutas conectadas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-navy-900/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden relative">
        <MapContainer 
          center={[-33.4569, -70.6483]} 
          zoom={11} 
          scrollWheelZoom={true} 
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Rutas Inferidas (Lines) - Basadas en datos reales de detección */}
          {activeLayers.routes && inferredRoutes
            .filter(route => {
              // Si hay una pantalla seleccionada, mostrar solo rutas que conectan con ella
              if (selectedScreenId !== null) {
                const selectedScreen = SCREENS.find(s => s.id === selectedScreenId);
                if (!selectedScreen) return false;
                return route.from.name === selectedScreen.commune || route.to.name === selectedScreen.commune;
              }
              return true;
            })
            .map((route, index) => (
              <Polyline 
                key={"route-" + index}
                positions={[[route.from.lat, route.from.lng], [route.to.lat, route.to.lng]]}
                pathOptions={{ 
                  color: '#00e5ff', 
                  weight: Math.min(route.count / 3, 3),
                  opacity: 0.8, 
                  dashArray: '8, 8' 
                }}
              >
                <Popup>
                  <div className="text-[#0a0a1a] p-2 min-w-[200px]">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-cyan-600" />
                      Ruta Inferida
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span><strong>Origen:</strong> {route.from.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span><strong>Destino:</strong> {route.to.name}</span>
                      </div>
                      <div className="border-t border-slate-300 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="opacity-70">Vehículos:</span>
                          <strong className="text-cyan-600">{route.count}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">Tiempo promedio:</span>
                          <strong>{Math.round(route.avgTime)} min</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">Frecuencia:</span>
                          <strong>{(route.count / 7).toFixed(1)}/día</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            ))}

          {/* Heatmap con gradientes suaves */}
          {activeLayers.heatmap && screenStats.length > 0 && (
            <HeatmapLayer
              points={heatmapPoints}
              radius={50}
              blur={30}
              maxZoom={14}
              gradient={{
                0.0: '#1e3a5f',
                0.2: '#0891b2',
                0.4: '#22c55e',
                0.6: '#eab308',
                0.8: '#f97316',
                1.0: '#dc2626'
              }}
            />
          )}

          {/* Cobertura (Circles) */}
          {activeLayers.coverage && screenStats.map(screen => (
            <Circle
              key={"cov-" + screen.id}
              center={[screen.lat, screen.lng]}
              radius={2500} // 2.5km
              pathOptions={{
                color: '#00e5ff',
                fillColor: '#00e5ff',
                fillOpacity: 0.05,
                weight: 1,
                dashArray: '4, 4'
              }}
            />
          ))}

          {/* Pantallas (Markers) */}
          {activeLayers.screens && screenStats.map(screen => (
            <Marker 
              key={"marker-" + screen.id}
              position={[screen.lat, screen.lng]}
              icon={createDotIcon(screen.status)}
              eventHandlers={{
                click: () => {
                  if (activeLayers.routes) {
                    toggleScreenSelection(screen.id);
                  }
                }
              }}
            >
              <Popup className="custom-popup bg-navy-900 border-white/10 text-white rounded-xl">
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-sm text-[#0a0a1a] mb-2">{screen.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#0a0a1a]">
                    <div>
                      <span className="opacity-70 block">Volumen</span>
                      <strong className="text-sm">{screen.volume}</strong>
                    </div>
                    <div>
                      <span className="opacity-70 block">Ad Score</span>
                      <strong className={
                        screen.status === 'high' ? 'text-sm text-green-600' : 
                        screen.status === 'medium' ? 'text-sm text-yellow-600' : 'text-sm text-red-600'
                      }>{screen.score}/100</strong>
                    </div>
                  </div>
                  {activeLayers.routes && (
                    <div className="mt-2 pt-2 border-t border-slate-300">
                      <p className="text-xs text-slate-500">
                        💡 Haz clic para ver solo las rutas de esta pantalla
                      </p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Indicador de pantalla seleccionada */}
          {selectedScreenId !== null && activeLayers.routes && (
            <Marker
              position={[-33.40, -70.58]}
              icon={L.divIcon({
                className: 'selected-screen-indicator',
                html: `<div style="
                  background: linear-gradient(135deg, #f472b6, #ec4899);
                  color: white;
                  padding: 12px 24px;
                  border-radius: 12px;
                  font-size: 13px;
                  font-weight: 600;
                  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.5);
                  white-space: nowrap;
                  backdrop-filter: blur(8px);
                  border: 1px solid rgba(255,255,255,0.2);
                ">
                  📍 ${SCREENS.find(s => s.id === selectedScreenId)?.commune} – Haz clic en otra pantalla o aquí para limpiar
                </div>`,
                iconSize: [450, 50],
                iconAnchor: [225, 25]
              })}
              eventHandlers={{
                click: () => setSelectedScreenId(null)
              }}
            />
          )}

          {/* Comunas (Labels + Polygons from GeoJSON) */}
          {activeLayers.comunas && comunasData.map(comuna => (
            <Polygon
              key={"comuna-" + comuna.name}
              positions={comuna.polygon}
              pathOptions={{
                color: '#a855f7',
                fillColor: '#a855f7',
                fillOpacity: 0.08,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-[#0a0a1a] p-1">
                  <h3 className="font-bold text-sm mb-1">{comuna.name}</h3>
                </div>
              </Popup>
            </Polygon>
          ))}
          
          {/* Comunas Labels - Nombres visibles en el mapa */}
          {activeLayers.comunasLabels && comunasData.map(comuna => (
            <Marker
              key={"label-" + comuna.name}
              position={[comuna.lat, comuna.lng]}
              icon={L.divIcon({
                className: 'comuna-label',
                html: `<div style="
                  background-color: rgba(168, 85, 247, 0.9);
                  padding: 6px 12px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 700;
                  color: white;
                  white-space: nowrap;
                  border: 1px solid rgba(255,255,255,0.4);
                  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
                  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                  backdrop-filter: blur(4px);
                ">${comuna.name}</div>`,
                iconSize: [comuna.name.length * 8 + 10, 24],
                iconAnchor: [(comuna.name.length * 8 + 10) / 2, 12],
                popupAnchor: [0, -12]
              })}
              zIndexOffset={1000}
            />
          ))}

          {/* Huecos de Cobertura */}
          {activeLayers.gaps && GAPS.map(gap => (
            <Marker
              key={gap.id}
              position={[gap.lat, gap.lng]}
              icon={gapIcon}
            >
              <Popup>
                <div className="text-[#0a0a1a] p-1">
                  <span className="uppercase text-[10px] font-bold text-magenta-600 tracking-wider">Oportunidad de Red</span>
                  <h3 className="font-bold text-sm mb-1">{gap.name}</h3>
                  <p className="text-xs">{gap.reason}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>
      
    </div>
  );
}

function LayerToggle({ active, onClick, icon: Icon, label, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300",
        active 
          ? "bg-white/10 border-white/20" 
          : "bg-transparent border-transparent hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", active ? color : "text-slate-500")} />
        <span className={cn("text-sm font-medium", active ? "text-white" : "text-slate-400")}>
          {label}
        </span>
      </div>
      <div className={cn(
        "w-8 h-4 rounded-full relative transition-colors duration-300",
        active ? "bg-cyan-500" : "bg-white/10"
      )}>
        <motion.div 
          layout
          initial={false}
          animate={{ x: active ? 16 : 2 }}
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
        />
      </div>
    </button>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: "0 0 8px " + color }}></div>
      <span className="text-xs text-slate-300">{label}</span>
    </div>
  );
}
