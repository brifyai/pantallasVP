import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  Brain,
  MapPin,
  Users,
  DollarSign,
  Clock,
  BarChart3,
  ArrowRight,
  X,
  CheckCircle2,
  Copy,
  Filter,
  Bell,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../utils/cn';

// Tipos
interface Insight {
  id: string;
  type: 'opportunity' | 'alert' | 'trend' | 'inventory' | 'competitor';
  priority: 'alta' | 'media' | 'baja';
  title: string;
  description: string;
  location?: string;
  timeframe?: string;
  audience?: string;
  estimatedValue?: number;
  action?: string;
  icon: any;
  color: string;
  gradient: string;
  data?: {
    label: string;
    value: string;
  }[];
  reasoning?: string;
  targetBrand?: string;
  targetIndustry?: string;
}

// Datos mock de insights unificados
const INSIGHTS_DATA: Insight[] = [
  // Oportunidad Destacada del Día
  {
    id: 'opp-1',
    type: 'opportunity',
    priority: 'alta',
    title: 'Oportunidad Premium - Vitacura',
    description: 'Los días Martes y Jueves entre las 07:00 y 09:00 hrs, el 42% de los vehículos detectados en Vitacura pertenecen a marcas premium. Existe un segmento no explotado para aseguradoras de alta gama.',
    location: 'Vitacura - Av. Kennedy',
    timeframe: 'Martes y Jueves 07:00-09:00 hrs',
    audience: '~2,500 vehículos premium/semana',
    estimatedValue: 2100000,
    action: 'Generar propuesta para aseguradoras premium',
    icon: Lightbulb,
    color: 'text-magenta-400',
    gradient: 'from-magenta-500/20 to-purple-500/20',
    data: [
      { label: 'Tráfico Promedio', value: '15,000 vehículos/día' },
      { label: 'Segmento Premium', value: '42%' },
      { label: 'Retención Visual', value: '78%' },
      { label: 'CPM Estimado', value: '$3,200' }
    ],
    reasoning: 'El análisis de patrones revela que el 68% de los vehículos premium residen en Vitacura, Lo Barnechea o Las Condes. Este segmento presenta una tasa de conversión 2.3x superior al promedio.',
    targetIndustry: 'Seguros de Alta Gama'
  },
  // Alertas en Tiempo Real
  {
    id: 'alert-1',
    type: 'alert',
    priority: 'alta',
    title: 'Aumento de Vehículos Eléctricos',
    description: 'Nueva tendencia detectada: aumento del 34% de vehículos eléctricos e híbridos en pantalla Vitacura durante el último mes.',
    location: 'Vitacura',
    timeframe: 'Últimos 30 días',
    icon: Zap,
    color: 'text-lime-400',
    gradient: 'from-lime-500/20 to-green-500/20',
    data: [
      { label: 'Crecimiento', value: '+34%' },
      { label: 'Vehículos Detectados', value: '890/mes' }
    ],
    reasoning: 'El crecimiento de vehículos eléctricos coincide con las nuevas políticas de movilidad sustentable. Oportunidad para marcas de tecnología verde.'
  },
  {
    id: 'alert-2',
    type: 'trend',
    priority: 'media',
    title: 'Concentración SUV Premium',
    description: 'Los SUV premium se concentran en pantallas Las Condes y Lo Barnechea entre 17:00-20:00 hrs con un 58% del flujo total.',
    location: 'Las Condes / Lo Barnechea',
    timeframe: '17:00-20:00 hrs',
    icon: TrendingUp,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    data: [
      { label: 'SUVs Premium', value: '58%' },
      { label: 'Vehículos/día', value: '3,200' }
    ]
  },
  {
    id: 'alert-3',
    type: 'competitor',
    priority: 'alta',
    title: 'Dominancia de Toyota',
    description: 'Toyota domina la ruta Providencia → Costanera Norte con un 22% del flujo total en horario AM.',
    location: 'Providencia - Costanera Norte',
    timeframe: '07:00-09:00 hrs',
    icon: Target,
    color: 'text-rose-400',
    gradient: 'from-rose-500/20 to-red-500/20',
    data: [
      { label: 'Share Toyota', value: '22%' },
      { label: 'Vehículos/día', value: '4,500' }
    ],
    targetBrand: 'Toyota',
    reasoning: 'Oportunidad para marcas competidoras (Nissan, Mazda, Hyundai) de interceptar audiencia en esta ruta.'
  },
  // Inventario No Vendido - Recomendaciones IA
  {
    id: 'inv-1',
    type: 'inventory',
    priority: 'alta',
    title: 'P-045 Quilicura - Oportunidad Logística',
    description: 'Pantalla con 78% de disponibilidad en Q2. Alto tráfico de vehículos comerciales livianos detectado.',
    location: 'Quilicura',
    timeframe: 'Q2 2025',
    estimatedValue: 4500000,
    action: 'Contactar gerente de marketing',
    icon: Brain,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-500/20',
    data: [
      { label: 'Disponibilidad', value: '78%' },
      { label: 'Vehículos Comerciales', value: '3x promedio' }
    ],
    reasoning: 'El análisis histórico muestra que esta zona tiene 3x más vehículos de reparto que el promedio. Empresas de logística aumentaron su inversión en OOH un 45% el último trimestre.',
    targetIndustry: 'Logística y Transporte',
    targetBrand: 'Starken / Chilexpress'
  },
  {
    id: 'inv-2',
    type: 'inventory',
    priority: 'media',
    title: 'P-052 La Pintana - Retail de Descuento',
    description: 'Zona con crecimiento del 23% en tráfico de vehículos segmento C. Pantalla disponible desde Abril.',
    location: 'La Pintana',
    timeframe: 'Desde Abril 2025',
    estimatedValue: 3200000,
    action: 'Preparar propuesta con datos de tráfico',
    icon: Brain,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-500/20',
    data: [
      { label: 'Crecimiento Tráfico', value: '+23%' },
      { label: 'Segmento', value: 'C2-C3' }
    ],
    reasoning: 'El perfil socioeconómico de la zona coincide con el target de retail de descuento. Competencia directa (Falabella) tuvo +31% de tráfico con campaña similar en zona sur.',
    targetIndustry: 'Retail de Descuento',
    targetBrand: 'Hites / Paris'
  },
  {
    id: 'inv-3',
    type: 'inventory',
    priority: 'alta',
    title: 'P-018 Puente Alto - Upsell Automotriz',
    description: 'Cliente actual Chevrolet tiene 65% de share en la pantalla. Oportunidad de vender slots restantes a competencia.',
    location: 'Puente Alto',
    timeframe: 'Disponible inmediatamente',
    estimatedValue: 5000000,
    action: 'Agendar reunión con Nissan',
    icon: Brain,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-500/20',
    data: [
      { label: 'Share Chevrolet', value: '65%' },
      { label: 'Crecimiento Nissan', value: '+12% YoY' }
    ],
    reasoning: 'La pantalla tiene alta efectividad para el segmento automotriz. Nissan no tiene presencia en esta zona y su cuota de mercado ha crecido 12% YoY.',
    targetIndustry: 'Automotriz',
    targetBrand: 'Nissan / Mazda / Hyundai'
  },
  {
    id: 'inv-4',
    type: 'inventory',
    priority: 'media',
    title: 'P-007 Vitacura - Bancos Premium',
    description: 'Pantalla premium con disponibilidad en Mayo. Históricamente alto tráfico de vehículos premium en este periodo.',
    location: 'Vitacura',
    timeframe: 'Mayo 2025',
    estimatedValue: 8500000,
    action: 'Enviar case study de Vitacura',
    icon: Brain,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-500/20',
    data: [
      { label: 'Tráfico Premium', value: 'Alto en Mayo' },
      { label: 'Segmento', value: 'AB' }
    ],
    reasoning: 'Mayo es el mes peak para productos de inversión. Itaú lanzó nueva línea de wealth management y no tiene presencia en pantallas premium del sector oriente.',
    targetIndustry: 'Bancos Premium',
    targetBrand: 'Banco Itaú / Scotiabank'
  },
  {
    id: 'inv-5',
    type: 'inventory',
    priority: 'alta',
    title: 'P-033 Providencia - Inmobiliarias',
    description: 'Pantalla con 82% de vehículos segmento AB. Disponible las próximas 3 semanas.',
    location: 'Providencia',
    timeframe: 'Próximas 3 semanas',
    estimatedValue: 6200000,
    action: 'Contactar con propuesta personalizada',
    icon: Brain,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-500/20',
    data: [
      { label: 'Segmento AB', value: '82%' },
      { label: 'Disponibilidad', value: '3 semanas' }
    ],
    reasoning: 'El perfil de audiencia coincide exactamente con compradores de proyectos inmobiliarios premium. Paic tiene 2 proyectos nuevos en la zona y no ha invertido en OOH este año.',
    targetIndustry: 'Inmobiliarias',
    targetBrand: 'Paic / Ilunion / Besalco'
  },
  {
    id: 'inv-6',
    type: 'inventory',
    priority: 'baja',
    title: 'P-041 Ñuñoa - Movilidad Eléctrica',
    description: 'Aumento del 34% en vehículos eléctricos en la zona. Pantalla con disponibilidad parcial.',
    location: 'Ñuñoa',
    timeframe: 'Q3 2025',
    estimatedValue: 4000000,
    action: 'Monitorear y contactar en Q3',
    icon: Brain,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-500/20',
    data: [
      { label: 'Crecimiento EV', value: '+34%' },
      { label: 'Disponibilidad', value: 'Parcial' }
    ],
    reasoning: 'Ñuñoa es la comuna con mayor crecimiento de vehículos eléctricos en Santiago. Tesla está en proceso de expansión y necesita visibilidad en zonas de alto potencial.',
    targetIndustry: 'Movilidad Eléctrica',
    targetBrand: 'Tesla / BYD / Volvo'
  }
];

const PRIORITY_FILTERS = ['todos', 'alta', 'media', 'baja'];
const TYPE_FILTERS = ['todos', 'opportunity', 'alert', 'trend', 'inventory', 'competitor'];

const formatCLP = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
};

export function Insights() {
  const [selectedPriority, setSelectedPriority] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [showProposal, setShowProposal] = useState(false);
  const [selectedInsightForProposal, setSelectedInsightForProposal] = useState<Insight | null>(null);

  // Filtrar insights
  const filteredInsights = INSIGHTS_DATA.filter(insight => {
    const priorityMatch = selectedPriority === 'todos' || insight.priority === selectedPriority;
    const typeMatch = selectedType === 'todos' || insight.type === selectedType;
    return priorityMatch && typeMatch;
  });

  // Contadores
  const counts = {
    total: INSIGHTS_DATA.length,
    alta: INSIGHTS_DATA.filter(i => i.priority === 'alta').length,
    media: INSIGHTS_DATA.filter(i => i.priority === 'media').length,
    baja: INSIGHTS_DATA.filter(i => i.priority === 'baja').length,
    opportunity: INSIGHTS_DATA.filter(i => i.type === 'opportunity').length,
    alert: INSIGHTS_DATA.filter(i => i.type === 'alert').length,
    trend: INSIGHTS_DATA.filter(i => i.type === 'trend').length,
    inventory: INSIGHTS_DATA.filter(i => i.type === 'inventory').length,
    competitor: INSIGHTS_DATA.filter(i => i.type === 'competitor').length
  };

  const handleGenerateProposal = (insight: Insight) => {
    setSelectedInsightForProposal(insight);
    setShowProposal(true);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      opportunity: 'Oportunidad',
      alert: 'Alerta',
      trend: 'Tendencia',
      inventory: 'Inventario',
      competitor: 'Competencia'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      opportunity: Lightbulb,
      alert: Bell,
      trend: TrendingUp,
      inventory: Brain,
      competitor: Target
    };
    return icons[type] || Lightbulb;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400">
            Insights & Recomendaciones
          </h1>
          <p className="text-gray-400 mt-1">Centro unificado de oportunidades y alertas inteligentes</p>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          <span className="text-sm text-gray-400">{counts.alta} alertas activas</span>
        </div>
      </div>

      {/* KPIs Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Total Insights</span>
          </div>
          <p className="text-2xl font-bold text-white">{counts.total}</p>
        </div>
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-rose-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-gray-400">Prioridad Alta</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">{counts.alta}</p>
        </div>
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Prioridad Media</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{counts.media}</p>
        </div>
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Prioridad Baja</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{counts.baja}</p>
        </div>
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Valor Estimado</span>
          </div>
          <p className="text-lg font-bold text-emerald-400">{formatCLP(INSIGHTS_DATA.reduce((acc, i) => acc + (i.estimatedValue || 0), 0))}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-2">Filtrar por Prioridad</label>
            <div className="flex flex-wrap gap-2">
              {PRIORITY_FILTERS.map(priority => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                    selectedPriority === priority
                      ? priority === 'alta'
                        ? 'bg-rose-500 text-white'
                        : priority === 'media'
                        ? 'bg-amber-500 text-white'
                        : priority === 'baja'
                        ? 'bg-blue-500 text-white'
                        : 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  )}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-2">Filtrar por Tipo</label>
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                    selectedType === type
                      ? 'bg-magenta-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  )}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Insights */}
      <div className="space-y-4">
        {filteredInsights.map((insight, index) => {
          const Icon = insight.icon;
          const isExpanded = expandedInsight === insight.id;
          const priorityColors = {
            alta: 'border-rose-500/30 bg-gradient-to-r from-rose-500/5 to-transparent',
            media: 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent',
            baja: 'border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-transparent'
          };

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "bg-navy-900/50 backdrop-blur-md rounded-xl border p-5 transition-all hover:border-opacity-60",
                priorityColors[insight.priority]
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icono */}
                <div className={cn("p-3 rounded-xl bg-gradient-to-br", insight.gradient)}>
                  <Icon className={cn("w-6 h-6", insight.color)} />
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          insight.priority === 'alta' ? 'bg-rose-500/20 text-rose-400' :
                          insight.priority === 'media' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        )}>
                          {insight.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                          {getTypeLabel(insight.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{insight.description}</p>
                    </div>

                    <button
                      onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>

                  {/* Metadata rápida */}
                  <div className="flex flex-wrap gap-4 mt-3">
                    {insight.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {insight.location}
                      </div>
                    )}
                    {insight.timeframe && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {insight.timeframe}
                      </div>
                    )}
                    {insight.estimatedValue && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        {formatCLP(insight.estimatedValue)}
                      </div>
                    )}
                  </div>

                  {/* Contenido expandido */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      {/* Data Grid */}
                      {insight.data && insight.data.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {insight.data.map((item, idx) => (
                            <div key={idx} className="bg-navy-950/50 border border-white/10 rounded-lg p-3 text-center">
                              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                              <p className="text-lg font-bold text-white">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Razonamiento de IA */}
                      {insight.reasoning && (
                        <div className="bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 border border-cyan-500/20 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-semibold text-cyan-400">Análisis de IA</span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{insight.reasoning}</p>
                        </div>
                      )}

                      {/* Target */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {insight.targetIndustry && (
                          <div className="bg-navy-950/50 border border-white/10 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Industria Sugerida</p>
                            <p className="text-sm font-medium text-cyan-400">{insight.targetIndustry}</p>
                          </div>
                        )}
                        {insight.targetBrand && (
                          <div className="bg-navy-950/50 border border-white/10 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Marca Objetivo</p>
                            <p className="text-sm font-medium text-magenta-400">{insight.targetBrand}</p>
                          </div>
                        )}
                      </div>

                      {/* Acción */}
                      <div className="flex gap-3">
                        {insight.action && (
                          <button
                            onClick={() => handleGenerateProposal(insight)}
                            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 hover:opacity-90 text-white font-medium rounded-lg transition-opacity flex items-center justify-center gap-2"
                          >
                            <Lightbulb className="w-4 h-4" />
                            {insight.action}
                          </button>
                        )}
                        <button className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal de Propuesta */}
      {showProposal && selectedInsightForProposal && typeof document !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowProposal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a1a] border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a1a]/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl bg-gradient-to-br", selectedInsightForProposal.gradient)}>
                  <selectedInsightForProposal.icon className={cn("w-6 h-6", selectedInsightForProposal.color)} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Generar Propuesta</h2>
                  <p className="text-xs text-gray-400">{selectedInsightForProposal.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProposal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Audiencia Objetivo */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-gray-400">AUDIENCIA OBJETIVO</span>
                </div>
                <p className="text-lg font-semibold text-white">{selectedInsightForProposal.audience || selectedInsightForProposal.targetIndustry || 'Segmento detectado por IA'}</p>
              </div>

              {/* Grid de Datos Clave */}
              <div className="grid grid-cols-2 gap-4">
                {selectedInsightForProposal.location && (
                  <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-medium text-gray-400">UBICACIÓN</span>
                    </div>
                    <p className="text-white font-medium">{selectedInsightForProposal.location}</p>
                  </div>
                )}
                {selectedInsightForProposal.timeframe && (
                  <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium text-gray-400">TIMEFRAME</span>
                    </div>
                    <p className="text-white font-medium">{selectedInsightForProposal.timeframe}</p>
                  </div>
                )}
                {selectedInsightForProposal.estimatedValue && (
                  <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-gray-400">INVERSIÓN EST.</span>
                    </div>
                    <p className="text-white font-medium">{formatCLP(selectedInsightForProposal.estimatedValue)}</p>
                  </div>
                )}
                {selectedInsightForProposal.data && selectedInsightForProposal.data[0] && (
                  <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-gray-400">DATO CLAVE</span>
                    </div>
                    <p className="text-white font-medium">{selectedInsightForProposal.data[0].value}</p>
                  </div>
                )}
              </div>

              {/* Recomendación Estratégica */}
              {selectedInsightForProposal.reasoning && (
                <div className="bg-gradient-to-br from-magenta-500/10 to-purple-500/10 border border-magenta-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-magenta-500/20 border border-magenta-500/30">
                      <Target className="w-5 h-5 text-magenta-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Recomendación Estratégica</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{selectedInsightForProposal.reasoning}</p>
                </div>
              )}

              {/* Acción Sugerida */}
              {selectedInsightForProposal.action && (
                <div className="border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Acción Sugerida</h3>
                  </div>
                  <p className="text-white font-medium">{selectedInsightForProposal.action}</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-[#0a0a1a]/95 backdrop-blur border-t border-white/10 p-6 flex gap-3">
              <button
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar Propuesta
              </button>
              <button
                onClick={() => setShowProposal(false)}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 hover:opacity-90 text-white font-medium rounded-lg transition-opacity"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}