import { KPICards } from '../components/dashboard/KPICards';
import { LiveFlowChart } from '../components/dashboard/LiveFlowChart';
import { TopBrandsChart } from '../components/dashboard/TopBrandsChart';
import { VehicleTypesChart } from '../components/dashboard/VehicleTypesChart';
import { WeeklyHeatmap } from '../components/dashboard/WeeklyHeatmap';
import { kpis, flowChartData, topBrandsData, vehicleTypesData } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowRight, Zap, Brain, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

// Insights resumidos para el Dashboard
const INSIGHTS_RESUMEN = [
  {
    id: 1,
    title: 'Oportunidad Premium - Vitacura',
    type: 'opportunity',
    icon: Lightbulb,
    color: 'text-magenta-400',
    bg: 'from-magenta-500/20 to-purple-500/20',
    description: '42% vehículos premium Martes y Jueves 07:00-09:00 hrs',
    value: '$2.1M',
    priority: 'alta'
  },
  {
    id: 2,
    title: 'Aumento Vehículos Eléctricos',
    type: 'trend',
    icon: Zap,
    color: 'text-lime-400',
    bg: 'from-lime-500/20 to-green-500/20',
    description: '+34% en Vitacura durante el último mes',
    value: '890/mes',
    priority: 'alta'
  },
  {
    id: 3,
    title: 'Inventario Disponible',
    type: 'inventory',
    icon: Brain,
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-orange-500/20',
    description: '6 pantallas con oportunidad detectada',
    value: '$31.4M',
    priority: 'media'
  },
  {
    id: 4,
    title: 'Alerta Competencia',
    type: 'competitor',
    icon: Target,
    color: 'text-rose-400',
    bg: 'from-rose-500/20 to-red-500/20',
    description: 'Toyota domina 22% en Providencia AM',
    value: '4,500/día',
    priority: 'alta'
  }
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 relative z-10">
      {/* Header Section */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 drop-shadow-md">Command Center</h1>
        <p className="text-gray-400 text-sm md:text-base">Inteligencia vehicular y optimización OOH en tiempo real.</p>
      </div>

      {/* KPIs */}
      <KPICards data={kpis} />

      {/* Insights Rápidos - Reemplaza OpportunityWidget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-navy-900/50 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-xl border border-cyan-500/30">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Insights Destacados</h2>
              <p className="text-xs text-gray-400">Oportunidades y alertas detectadas por IA</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/insights')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-magenta-500 hover:opacity-90 text-white text-sm font-medium rounded-lg transition-opacity flex items-center gap-2"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {INSIGHTS_RESUMEN.map((insight) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: insight.id * 0.1 }}
                onClick={() => navigate('/insights')}
                className="bg-navy-950/50 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", insight.bg)}>
                    <Icon className={cn("w-4 h-4", insight.color)} />
                  </div>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                    insight.priority === 'alta' ? 'bg-rose-500/20 text-rose-400' :
                    insight.priority === 'media' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  )}>
                    {insight.priority}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{insight.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{insight.value}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <LiveFlowChart data={flowChartData} />
        <TopBrandsChart data={topBrandsData} />
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <VehicleTypesChart data={vehicleTypesData} />
        <WeeklyHeatmap />
      </div>
    </div>
  );
}
