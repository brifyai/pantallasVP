import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MonitorPlay, 
  ArrowLeft, 
  MapPin, 
  TrendingUp, 
  Activity, 
  DollarSign,
  Car,
  Target,
  Info,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { SCREENS, recentDetections, PREMIUM_BRANDS } from '../data/mockData';
import { cn } from '../utils/cn';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function ScreenPerformance() {
  const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  // Calculate metrics for all screens
  const screenMetrics = useMemo(() => {
    return SCREENS.map(screen => {
      const screenDetections = recentDetections.filter(d => d.screenId === screen.id);
      const totalVolume = screenDetections.length;
      
      const premiumDetections = screenDetections.filter(d => PREMIUM_BRANDS.includes(d.vehicle.brand)).length;
      const premiumRatio = totalVolume > 0 ? premiumDetections / totalVolume : 0;
      
      // Calculate Ad Score (0-100) based on volume and premium ratio
      const maxVolumeSimulated = 5000; // max seen in our mock is roughly this
      const volumeScore = Math.min((totalVolume / maxVolumeSimulated) * 100, 100);
      const adScore = Math.round((volumeScore * 0.4) + (premiumRatio * 100 * 0.6));

      // Hourly Sparkline Data (last 7 hours for the mini chart)
      const hourlyData = Array.from({ length: 7 }).map((_, i) => {
        const hour = new Date().getHours() - (6 - i);
        const count = screenDetections.filter(d => new Date(d.timestamp).getHours() === (hour < 0 ? hour + 24 : hour)).length;
        return { hour, count };
      });

      return {
        ...screen,
        totalVolume,
        premiumRatio,
        adScore,
        sparkline: hourlyData,
        status: adScore > 20 ? 'active' : 'inactive',
        suggestedPrice: Math.round(adScore * 12.5) // Just a mock formula
      };
    }).sort((a, b) => b.adScore - a.adScore);
  }, []);

  const selectedScreen = useMemo(() => {
    if (!selectedScreenId) return null;
    return screenMetrics.find(s => s.id === selectedScreenId) || null;
  }, [selectedScreenId, screenMetrics]);

  // Specific detail metrics for the selected screen
  const screenDetailMetrics = useMemo(() => {
    if (!selectedScreen) return null;
    const detections = recentDetections.filter(d => d.screenId === selectedScreen.id);
    
    // Hourly flow for detail view
    const hourlyFlow = Array.from({ length: 24 }).map((_, i) => {
      const h = new Date().getHours() - (23 - i);
      const hour = h < 0 ? h + 24 : h;
      const count = detections.filter(d => new Date(d.timestamp).getHours() === hour).length;
      const timeLabel = hour.toString().padStart(2, "0") + ":00";
      return { 
        time: timeLabel, 
        volume: count 
      };
    });

    // Top Brands
    const brandCounts = detections.reduce((acc, curr) => {
      acc[curr.vehicle.brand] = (acc[curr.vehicle.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    return { hourlyFlow, topBrands, totalDetections: detections.length };
  }, [selectedScreen]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-[#00ff88] border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]';
    if (score >= 40) return 'text-[#00e5ff] border-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.3)]';
    return 'text-[#ff00e5] border-[#ff00e5] shadow-[0_0_10px_rgba(255,0,229,0.3)]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-[#00ff88] text-black';
    if (score >= 40) return 'bg-[#00e5ff] text-black';
    return 'bg-[#ff00e5] text-white';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <MonitorPlay className="w-8 h-8 text-[#00e5ff]" />
            Screen Performance
          </h1>
          <p className="text-slate-400 mt-1">
            Métricas de rendimiento algorítmico y comparativas por pantalla.
          </p>
        </div>
      </div>

      {/* Info Modal del Score */}
      <AnimatePresence>
        {showScoreInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowScoreInfo(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              onClick={() => setShowScoreInfo(false)}
            >
              <div 
                className="bg-[rgba(10,10,26,0.98)] backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-[#0a0a1a]/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
                      <Info className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">¿Qué es el Ad Score?</h2>
                  </div>
                  <button
                    onClick={() => setShowScoreInfo(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Definición */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 border border-cyan-500/20 rounded-xl p-5">
                    <p className="text-white font-medium leading-relaxed">
                      El <strong className="text-cyan-400">Ad Score</strong> es un puntaje del <strong className="text-white">0 al 100</strong> que mide el <strong className="text-emerald-400">valor publicitario</strong> de una pantalla digital, basado en el tráfico vehicular y el perfil de los vehículos que transitan por su ubicación.
                    </p>
                  </div>

                  {/* Componentes */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Componentes del Score</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                            <Activity className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">Volumen (40%)</p>
                            <p className="text-xs text-gray-400">Peso en el score</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          Cantidad total de vehículos que transitan por la pantalla. A mayor volumen, mayor alcance potencial de la campaña publicitaria.
                        </p>
                      </div>
                      
                      <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-magenta-500/20 border border-magenta-500/30">
                            <Car className="w-5 h-5 text-magenta-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">Premium Ratio (60%)</p>
                            <p className="text-xs text-gray-400">Peso en el score</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          Porcentaje de vehículos de marcas premium (BMW, Mercedes, Audi, etc.). Indica el poder adquisitivo de la audiencia.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fórmula */}
                  <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Fórmula</h3>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-center">
                      <p className="text-cyan-400 text-lg">
                        Ad Score = (Volumen Score × 0.4) + (Premium Ratio × 60)
                      </p>
                    </div>
                  </div>

                  {/* Interpretación */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Interpretación del Score</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl p-4">
                        <div className="w-12 h-12 rounded-full bg-[#00ff88] flex items-center justify-center text-black font-bold text-base whitespace-nowrap">
                          70+
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#00ff88] font-semibold">Alto Valor</p>
                          <p className="text-sm text-gray-300">Ideal para marcas de lujo, tecnología, bancos premium. Audiencia AB.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-xl p-4">
                        <div className="w-12 h-12 rounded-full bg-[#00e5ff] flex items-center justify-center text-black font-bold text-[11px] whitespace-nowrap">
                          40-69
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#00e5ff] font-semibold">Valor Medio</p>
                          <p className="text-sm text-gray-300">Ideal para retail, consumo masivo, telecomunicaciones. Audiencia C1-C2.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-[#ff00e5]/10 border border-[#ff00e5]/30 rounded-xl p-4">
                        <div className="w-12 h-12 rounded-full bg-[#ff00e5] flex items-center justify-center text-white font-bold text-base whitespace-nowrap">
                          0-39
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#ff00e5] font-semibold">Bajo Valor</p>
                          <p className="text-sm text-gray-300">Ideal para marcas de descuento, servicios básicos. Audiencia C3-D.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ejemplos */}
                  <div className="bg-gradient-to-br from-magenta-500/10 to-purple-500/10 border border-magenta-500/20 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Ejemplos Prácticos</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Vitacura / Las Condes</p>
                          <p className="text-xs text-gray-400">3000 vehículos/día, 45% premium</p>
                        </div>
                        <div className="px-3 py-1 bg-[#00ff88] text-black rounded-lg font-bold">85/100</div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Puente Alto / La Florida</p>
                          <p className="text-xs text-gray-400">5000 vehículos/día, 12% premium</p>
                        </div>
                        <div className="px-3 py-1 bg-[#00e5ff] text-black rounded-lg font-bold">42/100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedScreenId ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {screenMetrics.map((screen, index) => (
              <motion.div
                key={screen.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedScreenId(screen.id)}
                className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#00e5ff]/50 transition-all cursor-pointer group hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[#00e5ff] transition-colors">
                      {screen.name}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {screen.commune}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0a0a1a] px-2 py-1 rounded-md border border-white/5">
                    <div className={cn("w-2 h-2 rounded-full", screen.status === 'active' ? 'bg-[#00ff88] animate-pulse' : 'bg-red-500')} />
                    <span className="text-xs text-slate-300 capitalize">{screen.status}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Ad Score</p>
                      <button
                        onClick={() => setShowScoreInfo(true)}
                        className="p-0.5 hover:bg-white/10 rounded transition-colors"
                        title="¿Qué es el Ad Score?"
                      >
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    </div>
                    <div className={cn(
                      "text-2xl font-bold border px-3 py-1 rounded-lg inline-block",
                      getScoreColor(screen.adScore)
                    )}>
                      {screen.adScore}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Volumen/Día</p>
                    <p className="text-lg font-semibold text-white">{screen.totalVolume.toLocaleString('es-CL').replace(/,/g, '.')}</p>
                  </div>
                </div>

                <div className="h-12 w-full mt-4 border-t border-white/5 pt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={screen.sparkline}>
                      <defs>
                        <linearGradient id={`gradient-${screen.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#00e5ff" 
                        fill={`url(#gradient-${screen.id})`} 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setSelectedScreenId(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-navy-900/50 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Grid
            </button>

            {selectedScreen && screenDetailMetrics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 md:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <MonitorPlay className="w-8 h-8 text-[#00e5ff]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedScreen.name}</h2>
                        <p className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {selectedScreen.commune}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "ml-auto px-4 py-2 rounded-xl font-bold text-xl",
                          getScoreBg(selectedScreen.adScore)
                        )}>
                          Score: {selectedScreen.adScore}
                        </div>
                        <button
                          onClick={() => setShowScoreInfo(true)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="¿Qué es el Ad Score?"
                        >
                          <Info className="w-5 h-5 text-cyan-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 flex items-center gap-4">
                    <div className="p-4 bg-[#ff00e5]/10 rounded-full border border-[#ff00e5]/30 text-[#ff00e5]">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Tráfico Diario</p>
                      <p className="text-2xl font-bold text-white">{selectedScreen.totalVolume.toLocaleString('es-CL').replace(/,/g, '.')}</p>
                    </div>
                  </div>

                  <div className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 flex items-center gap-4">
                    <div className="p-4 bg-[#00ff88]/10 rounded-full border border-[#00ff88]/30 text-[#00ff88]">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Precio Sugerido / Día</p>
                      <p className="text-2xl font-bold text-white">${selectedScreen.suggestedPrice.toLocaleString('es-CL').replace(/,/g, '.')}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart: Hourly Flow */}
                  <div className="lg:col-span-2 bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#00e5ff]" />
                      Flujo Vehicular (24h)
                    </h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={screenDetailMetrics.hourlyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0a0a1a', borderColor: '#ffffff20', borderRadius: '8px' }}
                            itemStyle={{ color: '#00e5ff', fontWeight: 500 }}
                            labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="volume" 
                            name="Vehículos"
                            stroke="#00e5ff" 
                            fill="url(#flowGradient)" 
                            strokeWidth={3} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Top Brands at this Screen */}
                    <div className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 flex-1">
                      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Car className="w-5 h-5 text-[#ff00e5]" />
                        Top Marcas Detectadas
                      </h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={screenDetailMetrics.topBrands} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} hide />
                            <YAxis dataKey="name" type="category" stroke="#ffffff90" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                              cursor={{ fill: '#ffffff10' }}
                              contentStyle={{ backgroundColor: '#0a0a1a', borderColor: '#ffffff20', borderRadius: '8px' }}
                              itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
                              labelStyle={{ color: '#ff00e5', fontWeight: 600, marginBottom: '4px' }}
                            />
                            <Bar dataKey="value" name="Detecciones" radius={[0, 4, 4, 0]}>
                              {screenDetailMetrics.topBrands.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#ff00e5' : '#ff00e580'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Targeting Note */}
                    <div className="bg-navy-900/50 backdrop-blur-md border border-[#00ff88]/20 rounded-xl p-6 bg-gradient-to-br from-navy-900/50 to-[#00ff88]/10">
                      <h3 className="text-sm font-semibold text-[#00ff88] mb-2 flex items-center gap-2 uppercase tracking-wide">
                        <Target className="w-4 h-4" /> Targeting Ideal
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Con un Score Ad de <strong className="text-white">{selectedScreen.adScore}</strong> y un
                        {' '}<strong>{(selectedScreen.premiumRatio * 100).toFixed(1)}%</strong> de vehículos premium,
                        esta pantalla es óptima para anunciantes de 
                        {selectedScreen.adScore > 60 ? ' lujo, aseguradoras y tecnología.' : ' consumo masivo, retail y supermercados.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Section */}
                <div className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-white" />
                    Ubicación Exacta
                  </h3>
                  <div className="h-80 w-full rounded-xl overflow-hidden border border-white/10 relative z-0">
                    <MapContainer 
                      center={[selectedScreen.lat, selectedScreen.lng]} 
                      zoom={14} 
                      scrollWheelZoom={false}
                      className="w-full h-full"
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      />
                      <Marker position={[selectedScreen.lat, selectedScreen.lng]} icon={customIcon}>
                        <Popup className="dark-popup">
                          <div className="font-semibold text-black">{selectedScreen.name}</div>
                          <div className="text-xs text-gray-700">{selectedScreen.commune}</div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
