import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  History, TrendingUp, TrendingDown,
  Clock, CalendarDays, CloudRain, Trophy, Music, Zap, BarChart2,
  Download, Hourglass, BrainCircuit, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Bar, ReferenceArea
} from 'recharts';
import { cn } from '../utils/cn';

// --- UTILIDADES DE FECHA ---
const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};

const getDayName = (date: Date) => {
  return date.toLocaleDateString('es-ES', { weekday: 'short' });
};

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const isHoliday = (date: Date): boolean => {
  const holidays = [
    '01-01', '01-06', '03-21', '04-18', '05-01', '05-21',
    '06-21', '07-16', '08-15', '09-18', '09-19', '10-12',
    '11-01', '12-08', '12-25'
  ];
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return holidays.includes(key);
};

// --- GENERADOR DE DATOS HISTÓRICOS SIMULADOS ---
const generateHistoricalData = (days: number, endDate: Date = new Date()) => {
  const data = [];
  const baseFlow = 45000;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    const weekendFactor = isWeekend(date) ? 0.7 : 1.0;
    const holidayFactor = isHoliday(date) ? 0.5 : 1.0;
    const seasonalFactor = 0.9 + Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.1;
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    const flow = Math.round(baseFlow * weekendFactor * holidayFactor * seasonalFactor * randomFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      display: `${getDayName(date)} ${formatDate(date)}`,
      flow,
      isWeekend: isWeekend(date),
      isHoliday: isHoliday(date),
      dayOfWeek
    });
  }
  
  return data;
};

// --- ALGORITMO DE PREDICCIÓN SIMULADO (ARIMA-like) ---
const generatePredictions = (historicalData: any[], daysAhead: number = 7) => {
  if (historicalData.length < 7) return [];
  
  // Calcular media móvil de 7 días
  const recentFlows = historicalData.slice(-7).map(d => d.flow);
  const movingAvg = recentFlows.reduce((a, b) => a + b, 0) / 7;
  
  // Calcular tendencia
  const firstHalf = historicalData.slice(0, Math.floor(historicalData.length / 2));
  const secondHalf = historicalData.slice(Math.floor(historicalData.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b.flow, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b.flow, 0) / secondHalf.length;
  const trend = (secondAvg - firstAvg) / firstHalf.length;
  
  // Calcular estacionalidad semanal
  const dayOfWeekFactors: Record<number, number> = {};
  [0, 1, 2, 3, 4, 5, 6].forEach(day => {
    const dayFlows = historicalData.filter(d => d.dayOfWeek === day).map(d => d.flow);
    dayOfWeekFactors[day] = dayFlows.length > 0 
      ? dayFlows.reduce((a, b) => a + b, 0) / dayFlows.length / movingAvg 
      : 1.0;
  });
  
  // Generar predicciones
  const predictions = [];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  for (let i = 1; i <= daysAhead; i++) {
    const predDate = new Date(lastDate);
    predDate.setDate(predDate.getDate() + i);
    
    const dayFactor = dayOfWeekFactors[predDate.getDay()] || 1.0;
    const holidayFactor = isHoliday(predDate) ? 0.5 : 1.0;
    const weekendFactor = isWeekend(predDate) ? 0.85 : 1.0;
    
    // Predicción base con tendencia
    let predictedFlow = movingAvg + (trend * i);
    
    // Ajustar por día de semana
    predictedFlow *= dayFactor;
    
    // Ajustar por festivos/fin de semana
    predictedFlow *= holidayFactor * weekendFactor;
    
    // Calcular intervalo de confianza (95%)
    const stdDev = movingAvg * 0.12; // 12% desviación estándar estimada
    const confidenceInterval = 1.96 * stdDev * Math.sqrt(1 + i / 30);
    
    predictions.push({
      date: predDate.toISOString().split('T')[0],
      display: `${getDayName(predDate)} ${formatDate(predDate)}${isHoliday(predDate) ? ' (Festivo)' : ''}`,
      predict: Math.round(predictedFlow),
      lower: Math.round(predictedFlow - confidenceInterval),
      upper: Math.round(predictedFlow + confidenceInterval),
      isWeekend: isWeekend(predDate),
      isHoliday: isHoliday(predDate)
    });
  }
  
  return predictions;
};

// --- CÁPSULA DEL TIEMPO ---
const generateTimeCapsuleData = (targetDate: Date) => {
  const data = [];
  const baseFlow = 42000;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(targetDate);
    date.setDate(date.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const weekendFactor = isWeekend(date) ? 0.65 : 1.0;
    const holidayFactor = isHoliday(date) ? 0.4 : 1.0;
    const flow = Math.round(baseFlow * weekendFactor * holidayFactor * (0.85 + Math.random() * 0.3));
    
    data.push({
      date: date.toISOString().split('T')[0],
      display: `${getDayName(date)} ${formatDate(date)}`,
      flow,
      isWeekend: isWeekend(date),
      isHoliday: isHoliday(date)
    });
  }
  
  return data;
};

// --- DATOS DE EVENTOS ESPECIALES ---
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

const MetricCard = ({ title, value, previous, change, isPositive, subtitle }: any) => (
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
    <p className="text-xs text-gray-500">{subtitle || `vs ${previous} (período anterior)`}</p>
  </motion.div>
);

// Custom Tooltip para el gráfico de predicción con intervalo de confianza
const PredictionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0a0a1a] border border-white/20 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Predicción:</span>
            <span className="text-cyan-400 font-bold">{data.predict?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Mínimo (95%):</span>
            <span className="text-emerald-400">{data.lower?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Máximo (95%):</span>
            <span className="text-rose-400">{data.upper?.toLocaleString()}</span>
          </div>
          {data.isHoliday && (
            <div className="mt-2 pt-2 border-t border-white/10 text-fuchsia-400">
              🎉 Día Festivo
            </div>
          )}
          {data.isWeekend && !data.isHoliday && (
            <div className="mt-2 pt-2 border-t border-white/10 text-amber-400">
              📅 Fin de Semana
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function TimeMachine() {
  // Estados para comparación histórica
  const [comparisonMode, setComparisonMode] = useState<'day' | 'week' | 'month'>('week');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Estados para cápsula del tiempo
  const [timeCapsuleMode, setTimeCapsuleMode] = useState(false);
  const [timeCapsuleDate, setTimeCapsuleDate] = useState('2025-09-18');
  
  // Estados para simulador
  const [simHour, setSimHour] = useState(12);
  
  // Generar datos históricos
  const historicalData = useMemo(() => {
    const days = comparisonMode === 'day' ? 2 : comparisonMode === 'week' ? 14 : 60;
    return generateHistoricalData(days);
  }, [comparisonMode]);
  
  // Generar predicciones
  const predictions = useMemo(() => {
    return generatePredictions(historicalData, 7);
  }, [historicalData]);
  
  // Datos para cápsula del tiempo
  const timeCapsuleData = useMemo(() => {
    return generateTimeCapsuleData(new Date(timeCapsuleDate));
  }, [timeCapsuleDate]);
  
  // Combinar datos históricos con predicciones
  const combinedData = useMemo(() => {
    const historical = historicalData.map(d => ({
      ...d,
      predict: null,
      lower: null,
      upper: null
    }));
    const predicted = predictions.map(d => ({
      ...d,
      flow: null
    }));
    return [...historical, ...predicted];
  }, [historicalData, predictions]);
  
  // Calcular métricas comparativas
  const comparisonMetrics = useMemo(() => {
    if (comparisonMode === 'day') {
      const today = historicalData[historicalData.length - 1];
      const yesterday = historicalData[historicalData.length - 2];
      const changeNum = yesterday ? ((today.flow - yesterday.flow) / yesterday.flow * 100) : 0;
      const change = changeNum.toFixed(1);
      return {
        current: today.flow,
        previous: yesterday?.flow || 0,
        change: `${changeNum > 0 ? '+' : ''}${change}%`,
        isPositive: changeNum > 0
      };
    } else if (comparisonMode === 'week') {
      const thisWeek = historicalData.slice(-7).reduce((a, b) => a + b.flow, 0);
      const lastWeek = historicalData.slice(-14, -7).reduce((a, b) => a + b.flow, 0);
      const changeNum = ((thisWeek - lastWeek) / lastWeek * 100);
      const change = changeNum.toFixed(1);
      return {
        current: thisWeek,
        previous: lastWeek,
        change: `${changeNum > 0 ? '+' : ''}${change}%`,
        isPositive: changeNum > 0
      };
    } else {
      const thisMonth = historicalData.slice(-30).reduce((a, b) => a + b.flow, 0);
      const lastMonth = historicalData.slice(-60, -30).reduce((a, b) => a + b.flow, 0);
      const changeNum = ((thisMonth - lastMonth) / lastMonth * 100);
      const change = changeNum.toFixed(1);
      return {
        current: thisMonth,
        previous: lastMonth,
        change: `${changeNum > 0 ? '+' : ''}${change}%`,
        isPositive: changeNum > 0
      };
    }
  }, [historicalData, comparisonMode]);
  
  // Exportar datos
  const exportData = () => {
    const csvContent = [
      ['Fecha', 'Tipo', 'Flujo', 'Predicción', 'Mínimo', 'Máximo', 'Fin de Semana', 'Festivo'].join(','),
      ...historicalData.map(d => 
        [d.date, 'Histórico', d.flow, '', '', '', d.isWeekend ? 'Sí' : 'No', d.isHoliday ? 'Sí' : 'No'].join(',')
      ),
      ...predictions.map(d => 
        [d.date, 'Predicción', '', d.predict, d.lower, d.upper, d.isWeekend ? 'Sí' : 'No', d.isHoliday ? 'Sí' : 'No'].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-machine-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header con controles avanzados */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-cyan-400" />
            Time Machine
          </h1>
          <p className="text-gray-400 mt-1">
            Análisis histórico, predicción con IA y cápsula del tiempo
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de modo */}
          <div className="flex items-center bg-navy-900 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => { setComparisonMode('day'); setTimeCapsuleMode(false); }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                comparisonMode === 'day' && !timeCapsuleMode ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"
              )}
            >
              Día a Día
            </button>
            <button
              onClick={() => { setComparisonMode('week'); setTimeCapsuleMode(false); }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                comparisonMode === 'week' && !timeCapsuleMode ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"
              )}
            >
              Semana
            </button>
            <button
              onClick={() => { setComparisonMode('month'); setTimeCapsuleMode(false); }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                comparisonMode === 'month' && !timeCapsuleMode ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"
              )}
            >
              Mes
            </button>
          </div>
          
          {/* Botón Cápsula del Tiempo */}
          <button
            onClick={() => setTimeCapsuleMode(!timeCapsuleMode)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
              timeCapsuleMode 
                ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30" 
                : "bg-navy-900 text-gray-400 border border-white/10 hover:text-white"
            )}
          >
            <Hourglass className="w-4 h-4" />
            Cápsula del Tiempo
          </button>
          
          {/* Botón Exportar */}
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-navy-900 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Panel de Cápsula del Tiempo */}
      {timeCapsuleMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 backdrop-blur-md border border-fuchsia-500/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Hourglass className="w-6 h-6 text-fuchsia-400" />
            <h2 className="text-xl font-bold text-white">Cápsula del Tiempo</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Viaja a cualquier fecha del pasado para ver cómo era el tráfico en ese momento.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="date"
              value={timeCapsuleDate}
              onChange={(e) => setTimeCapsuleDate(e.target.value)}
              className="bg-navy-900 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fuchsia-500"
            />
            <span className="text-sm text-gray-400">
              Mostrando datos desde el <span className="text-fuchsia-400 font-medium">{timeCapsuleDate}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title={`Flujo ${timeCapsuleMode ? 'Histórico' : comparisonMode === 'day' ? 'Hoy' : comparisonMode === 'week' ? 'Esta Semana' : 'Este Mes'}`}
          value={timeCapsuleMode 
            ? (timeCapsuleData.reduce((a, b) => a + b.flow, 0) / 7).toFixed(0) + '/día'
            : (comparisonMetrics.current / (comparisonMode === 'day' ? 1 : comparisonMode === 'week' ? 7 : 30)).toFixed(0) + '/día'
          }
          previous={comparisonMetrics.previous}
          change={comparisonMetrics.change}
          isPositive={comparisonMetrics.isPositive}
          subtitle={timeCapsuleMode ? `Semana del ${timeCapsuleDate}` : undefined}
        />
        <MetricCard 
          title="Predicción 7 días" 
          value={predictions.reduce((a, b) => a + b.predict, 0).toLocaleString()}
          previous="-"
          change="IA Active"
          isPositive={true}
          subtitle="Basado en patrón histórico"
        />
        <MetricCard 
          title="Precisión Modelo" 
          value="94.2%"
          previous="92.8%"
          change="+1.4%"
          isPositive={true}
          subtitle="Últimos 30 días"
        />
        <MetricCard 
          title="Días Festivos Restantes" 
          value={3}
          previous="2"
          change="+1"
          isPositive={false}
          subtitle="Impacto estimado: -40%"
        />
      </div>

      {/* Gráfico Principal con Predicciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              {timeCapsuleMode ? 'Datos Históricos de Cápsula' : 'Histórico + Predicción con IA'}
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
                <span className="text-gray-400">Histórico</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-gray-400">Predicción</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                <span className="text-gray-400">Intervalo 95%</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeCapsuleMode ? timeCapsuleData : combinedData}>
                <defs>
                  <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="display" 
                  stroke="#ffffff50" 
                  fontSize={10} 
                  tick={{ fill: '#ffffff50' }}
                  interval={timeCapsuleMode ? 0 : 'preserveStartEnd'}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#ffffff50" 
                  fontSize={10} 
                  tick={{ fill: '#ffffff50' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<PredictionTooltip />} />
                
                {/* Área histórica */}
                <Area 
                  type="monotone" 
                  dataKey="flow" 
                  stroke="#d946ef" 
                  strokeWidth={2}
                  fill="url(#colorHistorical)" 
                  name="Histórico"
                />
                
                {/* Línea de predicción */}
                {!timeCapsuleMode && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="predict" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                      name="Predicción"
                    />
                    
                    {/* Intervalo de confianza */}
                    <Area 
                      type="monotone" 
                      dataKey="upper" 
                      stroke="none"
                      fill="url(#colorPredict)" 
                      name="Intervalo Superior"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lower" 
                      stroke="none"
                      fill="#0a0a1a" 
                      name="Intervalo Inferior"
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Leyenda de festivos */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-gray-400">Factores considerados:</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-fuchsia-500/20 text-fuchsia-400">📅 Festivos</span>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400">🌙 Fin de Semana</span>
              <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">📈 Estacionalidad</span>
            </div>
          </div>
        </motion.div>

        {/* Panel de Información del Modelo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Detalles del Modelo</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Algoritmo</h3>
              <p className="text-xs text-gray-300">
                ARIMA estacional con ajustes por día de semana, festivos y tendencia móvil.
              </p>
            </div>
            
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">Intervalo de Confianza</h3>
              <p className="text-xs text-gray-300">
                95% de confianza con banda dinámica que aumenta con la distancia temporal.
              </p>
            </div>
            
            <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-fuchsia-400 mb-2">Features del Modelo</h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Día de la semana (Lun-Dom)</li>
                <li>• Festivos nacionales</li>
                <li>• Fin de semana</li>
                <li>• Estacionalidad mensual</li>
                <li>• Tendencia de corto plazo</li>
                <li>• Media móvil 7 días</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Último retrain:</span>
                <span className="text-white">Hace 2 días</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Próximo retrain:</span>
                <span className="text-cyan-400">En 5 días</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Eventos Especiales y Simulador */}
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
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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