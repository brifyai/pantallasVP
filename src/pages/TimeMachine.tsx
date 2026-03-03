import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, TrendingUp, TrendingDown,
  Clock, CalendarDays, CloudRain, Trophy, Music, Zap, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Bar
} from 'recharts';
import { cn } from '../utils/cn';

// --- MOCK DATA PARA TIME MACHINE ---
const comparativeData = [
  { day: 'Lun', actual: 42000, anterior: 39500 },
  { day: 'Mar', actual: 45000, anterior: 44000 },
  { day: 'Mié', actual: 46500, anterior: 43200 },
  { day: 'Jue', actual: 48000, anterior: 47500 },
  { day: 'Vie', actual: 52000, anterior: 49000 },
  { day: 'Sáb', actual: 38000, anterior: 35000 },
  { day: 'Dom', actual: 31000, anterior: 32500 },
];

const predictiveData = [
  { date: '10 Oct', real: 45000, predict: null },
  { date: '11 Oct', real: 48000, predict: null },
  { date: '12 Oct', real: 51000, predict: null },
  { date: '13 Oct (Hoy)', real: 42000, predict: 42500 },
  { date: '14 Oct', real: null, predict: 46000 },
  { date: '15 Oct', real: null, predict: 47500 },
  { date: '16 Oct', real: null, predict: 49000 },
];

const specialEvents = [
  {
    id: 1,
    title: 'Partido Colo Colo vs U. de Chile',
    date: '12 Octubre, 15:30',
    type: 'sports',
    icon: Trophy,
    impact: '+45%',
    location: 'Pantallas Eje Macul / Ñuñoa',
    description: 'Aumento masivo de tráfico hacia el estadio.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10'
  },
  {
    id: 2,
    title: 'Frente de Mal Tiempo (Lluvia)',
    date: '08 Octubre, Todo el día',
    type: 'weather',
    icon: CloudRain,
    impact: '-18%',
    location: 'Toda la red (Especial RM Sur)',
    description: 'Disminución general del flujo, aumento de tiempos de viaje.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  {
    id: 3,
    title: 'Concierto Estadio Nacional',
    date: '05 Octubre, 21:00',
    type: 'event',
    icon: Music,
    impact: '+210%',
    location: 'Pantallas Av. Grecia / Pedro de Valdivia',
    description: 'Colapso horario post-evento. Alta presencia SUVs.',
    color: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-400/10'
  }
];

const hourlySimulationData = Array.from({ length: 24 }).map((_, i) => ({
  hour: i,
  label: `${i.toString().padStart(2, '0')}:00`,
  flow: Math.min(100, ((Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2) + 1) * 40 +
        (i === 8 || i === 18 ? 50 : 0) + Math.random() * 15))
}));

// --- COMPONENTES ---

const MetricCard = ({ title, value, previous, change, isPositive }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5 relative overflow-hidden"
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <div className="flex items-end gap-3 mb-2">
      <span className="text-3xl font-bold text-white">{value}</span>
      <div className={cn(
        "flex items-center text-sm font-medium mb-1",
        isPositive ? "text-emerald-400" : "text-rose-400"
      )}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {change}
      </div>
    </div>
    <p className="text-xs text-gray-500">vs {previous} (período anterior)</p>
  </motion.div>
);

export function TimeMachine() {
  const [period, setPeriod] = useState('week');
  const [simHour, setSimHour] = useState(12);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-cyan-400" />
            Time Machine
          </h1>
          <p className="text-gray-400 mt-1">
            Análisis histórico, predicción algorítmica y correlación de eventos
          </p>
        </div>
        <div className="flex items-center bg-navy-900 rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setPeriod('week')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              period === 'week' ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"
            )}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              period === 'month' ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"
            )}
          >
            Mes
          </button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Flujo Total" 
          value="302.5K" 
          previous="285.2K" 
          change="+6.1%" 
          isPositive={true} 
        />
        <MetricCard 
          title="Vehículos Únicos" 
          value="184.1K" 
          previous="190.5K" 
          change="-3.4%" 
          isPositive={false} 
        />
        <MetricCard 
          title="Tasa de Retención" 
          value="42.5%" 
          previous="38.2%" 
          change="+4.3%" 
          isPositive={true} 
        />
        <MetricCard 
          title="Eficiencia Ad Score" 
          value="84/100" 
          previous="81/100" 
          change="+3 pts" 
          isPositive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Comparativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-fuchsia-400" />
              Comparativa de Flujo (Actual vs Anterior)
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
                <span className="text-gray-400">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-gray-400">Anterior</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={comparativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a1a', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
                  labelStyle={{ color: '#d946ef', fontWeight: 600, marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="anterior" 
                  stroke="#6b7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent" 
                  name="Período Anterior"
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#d946ef" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  name="Período Actual"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Predictor de Flujo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Predictor (AI)
            </h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Proyección algorítmica de tráfico para los próximos 3 días.
          </p>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={predictiveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a1a', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
                  labelStyle={{ color: '#06b6d4', fontWeight: 600, marginBottom: '4px' }}
                />
                <Bar dataKey="real" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Real" maxBarSize={30} />
                <Line 
                  type="monotone" 
                  dataKey="predict" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ r: 4, fill: '#10b981' }}
                  name="Proyección"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eventos Especiales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
            Impacto de Eventos Especiales
          </h2>
          <div className="space-y-4">
            {specialEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="group relative bg-[#0a0a1a]/50 border border-white/5 rounded-xl p-4 transition-all hover:bg-white/5">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg flex-shrink-0", event.bgColor)}>
                      <Icon className={cn("w-6 h-6", event.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-white font-medium">{event.title}</h3>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-bold",
                          event.impact.startsWith('+') ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        )}>
                          {event.impact}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {event.date}
                      </p>
                      <p className="text-sm text-gray-300 mt-2">{event.description}</p>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                        <Zap className="w-3 h-3" /> {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Simulador de Flujo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Simulador de Patrones (Time-Lapse)
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Desliza para visualizar la acumulación de tráfico a lo largo de un día promedio.
          </p>

          <div className="flex-1 mb-6 min-h-[180px]">
            <div className="flex items-end justify-between h-40 gap-1 px-2 pt-[45px] mt-[45px]">
              {hourlySimulationData.map((data, idx) => (
                <div key={idx} className="relative flex-1 flex justify-center items-end h-full">
                  <motion.div
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-300",
                      idx === simHour ? "bg-cyan-400" : idx < simHour ? "bg-cyan-400/40" : "bg-white/10"
                    )}
                    style={{ height: `${Math.max(data.flow, 5)}%` }}
                    layoutId={`bar-${idx}`}
                  />
                  {idx === simHour && (
                    <motion.div
                      layoutId="active-badge"
                      className="absolute -top-8 bg-cyan-400 text-[#0a0a1a] text-xs font-bold px-2 py-1 rounded whitespace-nowrap z-10"
                    >
                      {data.label}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          <div className="mt-auto">
            <input 
              type="range" 
              min="0" 
              max="23" 
              value={simHour} 
              onChange={(e) => setSimHour(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-white font-medium text-xl bg-[#0a0a1a] px-4 py-2 rounded-lg border border-white/10">
                {simHour.toString().padStart(2, '0')}:00 hrs
              </span>
              <div className="text-right">
                <span className="block text-sm text-gray-400">Intensidad Relativa</span>
                <span className="block text-cyan-400 font-bold">
                  {Math.round(hourlySimulationData[simHour].flow)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
