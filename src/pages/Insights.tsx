import { useState, useMemo } from 'react';
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
  ChevronUp,
  Building2,
  Tag,
  Briefcase
} from 'lucide-react';
import { cn } from '../utils/cn';
import { MARCAS, getMarcaById } from '../data/marcas';
import { RUBROS, getRubroById } from '../data/rubros';
import { AGENCIAS, getAgenciaById, isDirecto } from '../data/agencias';
import { VENDEDORES, getVendedorById, getVendedorByMarca } from '../data/vendedores';

// Tipos
interface Insight {
  id: string;
  type: 'oportunidad' | 'alerta' | 'tendencia' | 'inventario' | 'competencia';
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
  vendedorId?: string;
  agenciaId?: string;
}

// Generador de insights basado en data real
const generateInsightsFromData = (): Insight[] => {
  const insights: Insight[] = [];

  // Insights por marca con vendedor asignado
  MARCAS.filter(m => m.activo).forEach(marca => {
    const rubro = getRubroById(marca.rubroId);
    const agencia = getAgenciaById(marca.agenciaId);
    const vendedor = getVendedorByMarca(marca.id);

    // Insight de oportunidad por rubro
    if (rubro) {
      insights.push({
        id: `opp-${marca.id}`,
        type: 'oportunidad',
        priority: 'alta',
        title: `${marca.nombre} - Oportunidad en ${rubro.nombre}`,
        description: `${marca.nombre} tiene alta presencia en zonas de tráfico premium. Se recomienda reforzar campaña en pantallas de Vitacura y Las Condes para maximizar reach del segmento AB.`,
        location: 'Vitacura / Las Condes',
        timeframe: 'Próximas 4 semanas',
        estimatedValue: Math.floor(Math.random() * 5000000) + 3000000,
        action: `Contactar a ${agencia?.nombre || 'agencia'} para renovar campaña`,
        icon: Lightbulb,
        color: marca.color ? `text-[${marca.color}]` : 'text-cyan-400',
        gradient: `from-${marca.color || '06b6d4'}/20 to-magenta-500/20`,
        data: [
          { label: 'Share Tráfico', value: `${Math.floor(Math.random() * 30) + 10}%` },
          { label: 'Retención Visual', value: `${Math.floor(Math.random() * 20) + 70}%` },
          { label: 'Reach Semanal', value: `${Math.floor(Math.random() * 50000) + 20000}` },
          { label: 'CPM Est.', value: `$${Math.floor(Math.random() * 2000) + 1500}` }
        ],
        reasoning: `El análisis de tráfico muestra que ${marca.nombre} tiene alta penetración en el rubro ${rubro.nombre.toLowerCase()}. La audiencia detectada coincide con el target de la marca.`,
        targetIndustry: rubro.nombre,
        targetBrand: marca.nombre,
        vendedorId: vendedor?.id,
        agenciaId: agencia?.id
      });
    }

    // Insight de competencia para marcas del mismo rubro
    const marcasMismoRubro = MARCAS.filter(m => m.rubroId === marca.rubroId && m.id !== marca.id && m.activo);
    if (marcasMismoRubro.length > 0 && Math.random() > 0.5) {
      const competidor = marcasMismoRubro[Math.floor(Math.random() * marcasMismoRubro.length)];
      insights.push({
        id: `comp-${marca.id}-${competidor.id}`,
        type: 'competencia',
        priority: 'media',
        title: `${marca.nombre} vs ${competidor.nombre}`,
        description: `${competidor.nombre} ha aumentado su presencia en un 15% durante el último mes. Oportunidad de contra-atacar con campaña focalizada.`,
        location: 'Providencia / Ñuñoa',
        timeframe: 'Últimos 30 días',
        estimatedValue: Math.floor(Math.random() * 3000000) + 2000000,
        action: `Generar propuesta defensiva para ${marca.nombre}`,
        icon: Target,
        color: 'text-rose-400',
        gradient: 'from-rose-500/20 to-red-500/20',
        data: [
          { label: `Share ${competidor.nombre}`, value: `${Math.floor(Math.random() * 20) + 15}%` },
          { label: 'Crecimiento', value: '+15%' },
          { label: 'Pantallas Activas', value: `${Math.floor(Math.random() * 10) + 3}` }
        ],
        reasoning: `${competidor.nombre} está invirtiendo más en zonas estratégicas. Se recomienda aumentar frecuencia en pantallas clave para mantener liderazgo.`,
        targetIndustry: rubro?.nombre,
        targetBrand: marca.nombre,
        vendedorId: vendedor?.id,
        agenciaId: agencia?.id
      });
    }
  });

  // Insights de inventario disponible
  const pantallasDisponibles = [
    { id: 'P-045', location: 'Quilicura', segment: 'C2-C3' },
    { id: 'P-052', location: 'La Pintana', segment: 'C3' },
    { id: 'P-018', location: 'Puente Alto', segment: 'C2' },
    { id: 'P-007', location: 'Vitacura', segment: 'AB' },
    { id: 'P-033', location: 'Providencia', segment: 'AB' }
  ];

  pantallasDisponibles.forEach(pantalla => {
    const marcasPotenciales = MARCAS.filter(m => m.activo && Math.random() > 0.6);
    const marcaRecomendada = marcasPotenciales[0];
    const rubro = marcaRecomendada ? getRubroById(marcaRecomendada.rubroId) : null;
    const vendedor = marcaRecomendada ? getVendedorByMarca(marcaRecomendada.id) : null;
    const agencia = marcaRecomendada ? getAgenciaById(marcaRecomendada.agenciaId) : null;

    insights.push({
      id: `inv-${pantalla.id}`,
      type: 'inventario',
      priority: pantalla.location === 'Vitacura' || pantalla.location === 'Providencia' ? 'alta' : 'media',
      title: `${pantalla.id} ${pantalla.location} - Oportunidad ${rubro?.nombre || 'Multirubro'}`,
      description: `Pantalla con 78% de disponibilidad en Q2. Alto tráfico de vehículos segmento ${pantalla.segment} detectado. Ideal para marcas de ${rubro?.nombre.toLowerCase() || 'diversos rubros'}.`,
      location: pantalla.location,
      timeframe: 'Q2 2025',
      estimatedValue: Math.floor(Math.random() * 4000000) + 2500000,
      action: marcaRecomendada ? `Contactar ${marcaRecomendada.nombre} (${agencia?.nombre || 'Directo'})` : 'Contactar prospectos del rubro',
      icon: Brain,
      color: 'text-amber-400',
      gradient: 'from-amber-500/20 to-orange-500/20',
      data: [
        { label: 'Disponibilidad', value: '78%' },
        { label: 'Tráfico Promedio', value: `${Math.floor(Math.random() * 10000) + 5000}/día` },
        { label: 'Segmento', value: pantalla.segment }
      ],
      reasoning: `El perfil de audiencia de ${pantalla.location} coincide con el target de ${rubro?.nombre || 'múltiples rubros'}. Históricamente esta zona tiene alta conversión para campañas OOH.`,
      targetIndustry: rubro?.nombre,
      targetBrand: marcaRecomendada?.nombre,
      vendedorId: vendedor?.id,
      agenciaId: agencia?.id
    });
  });

  // Alertas de tendencias
  insights.push(
    {
      id: 'trend-ev',
      type: 'tendencia',
      priority: 'alta',
      title: 'Aumento de Vehículos Eléctricos',
      description: 'Nueva tendencia detectada: aumento del 34% de vehículos eléctricos e híbridos en pantallas de Vitacura y Las Condes durante el último mes.',
      location: 'Vitacura / Las Condes',
      timeframe: 'Últimos 30 días',
      icon: Zap,
      color: 'text-lime-400',
      gradient: 'from-lime-500/20 to-green-500/20',
      data: [
        { label: 'Crecimiento', value: '+34%' },
        { label: 'Vehículos Detectados', value: '890/mes' },
        { label: 'Proyección Q2', value: '+45%' }
      ],
      reasoning: 'El crecimiento de vehículos eléctricos coincide con las nuevas políticas de movilidad sustentable. Oportunidad para marcas de tecnología verde y automóviles premium.',
      targetIndustry: 'Automotriz / Tecnología',
      targetBrand: 'Tesla / BYD / BMW / Volvo'
    },
    {
      id: 'trend-suv',
      type: 'tendencia',
      priority: 'media',
      title: 'Concentración SUV Premium',
      description: 'Los SUV premium se concentran en pantallas de Las Condes y Lo Barnechea entre 17:00-20:00 hrs con un 58% del flujo total.',
      location: 'Las Condes / Lo Barnechea',
      timeframe: '17:00-20:00 hrs',
      icon: TrendingUp,
      color: 'text-cyan-400',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      data: [
        { label: 'SUVs Premium', value: '58%' },
        { label: 'Vehículos/día', value: '3.200' }
      ],
      reasoning: 'El horario de retorno del trabajo concentra vehículos de alto poder adquisitivo. Ideal para marcas de lujo y servicios financieros premium.'
    }
  );

  return insights.sort((a, b) => {
    const priorityOrder = { alta: 0, media: 1, baja: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

const PRIORITY_FILTERS = ['todos', 'alta', 'media', 'baja'];
const TYPE_FILTERS = ['todos', 'oportunidad', 'alerta', 'tendencia', 'inventario', 'competencia'];

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
  const [filterVendedor, setFilterVendedor] = useState<string>('todos');

  // Generar insights desde data real
  const INSIGHTS_DATA = useMemo(() => generateInsightsFromData(), []);

  // Filtrar insights
  const filteredInsights = useMemo(() => {
    return INSIGHTS_DATA.filter(insight => {
      const priorityMatch = selectedPriority === 'todos' || insight.priority === selectedPriority;
      const typeMatch = selectedType === 'todos' || insight.type === selectedType;
      const vendedorMatch = filterVendedor === 'todos' || insight.vendedorId === filterVendedor;
      return priorityMatch && typeMatch && vendedorMatch;
    });
  }, [INSIGHTS_DATA, selectedPriority, selectedType, filterVendedor]);

  // Contadores
  const counts = useMemo(() => ({
    total: INSIGHTS_DATA.length,
    alta: INSIGHTS_DATA.filter(i => i.priority === 'alta').length,
    media: INSIGHTS_DATA.filter(i => i.priority === 'media').length,
    baja: INSIGHTS_DATA.filter(i => i.priority === 'baja').length,
    oportunidad: INSIGHTS_DATA.filter(i => i.type === 'oportunidad').length,
    alerta: INSIGHTS_DATA.filter(i => i.type === 'alerta').length,
    tendencia: INSIGHTS_DATA.filter(i => i.type === 'tendencia').length,
    inventario: INSIGHTS_DATA.filter(i => i.type === 'inventario').length,
    competencia: INSIGHTS_DATA.filter(i => i.type === 'competencia').length,
    valorTotal: INSIGHTS_DATA.reduce((acc, i) => acc + (i.estimatedValue || 0), 0)
  }), [INSIGHTS_DATA]);

  const handleGenerateProposal = (insight: Insight) => {
    setSelectedInsightForProposal(insight);
    setShowProposal(true);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      oportunidad: 'Oportunidad',
      alerta: 'Alerta',
      tendencia: 'Tendencia',
      inventario: 'Inventario',
      competencia: 'Competencia'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      oportunidad: Lightbulb,
      alerta: Bell,
      tendencia: TrendingUp,
      inventario: Brain,
      competencia: Target
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
          <p className="text-gray-400 mt-1">Centro unificado de oportunidades basado en datos reales de marcas y tráfico</p>
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
            <span className="text-xs text-gray-400">Valor Total</span>
          </div>
          <p className="text-lg font-bold text-emerald-400">{formatCLP(counts.valorTotal)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div className="flex flex-col gap-4">
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-2">Filtrar por Vendedor</label>
              <select
                value={filterVendedor}
                onChange={(e) => setFilterVendedor(e.target.value)}
                className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="todos">Todos los vendedores</option>
                {VENDEDORES.filter(v => v.activo).map(vendedor => (
                  <option key={vendedor.id} value={vendedor.id}>{vendedor.nombre}</option>
                ))}
              </select>
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
            alta: 'border-rose-500/30',
            media: 'border-amber-500/30',
            baja: 'border-blue-500/30'
          };

          const marca = insight.targetBrand ? MARCAS.find(m => m.nombre === insight.targetBrand) : null;
          const rubro = marca ? getRubroById(marca.rubroId) : null;
          const agencia = marca ? getAgenciaById(marca.agenciaId) : null;
          const vendedor = marca ? getVendedorByMarca(marca.id) : null;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "bg-[rgba(26,26,46,0.6)] backdrop-blur-md rounded-xl border p-5 transition-all hover:border-opacity-60",
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
                      
                      {/* Tags de marca, rubro y agencia */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {marca && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${marca.color}20`, color: marca.color }}
                          >
                            <Building2 className="w-3 h-3" />
                            {marca.nombre}
                          </span>
                        )}
                        {rubro && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${rubro.color}20`, color: rubro.color }}
                          >
                            <Tag className="w-3 h-3" />
                            {rubro.nombre}
                          </span>
                        )}
                        {agencia && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${agencia.color}20`, color: agencia.color }}
                          >
                            <Briefcase className="w-3 h-3" />
                            {isDirecto(agencia.id) ? 'Directo' : agencia.nombre.split(' ')[0]}
                          </span>
                        )}
                        {vendedor && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                            <Users className="w-3 h-3" />
                            {vendedor.nombre}
                          </span>
                        )}
                      </div>
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

                      {/* Target y Vendedor */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
                        {vendedor && (
                          <div className="bg-navy-950/50 border border-white/10 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Vendedor Asignado</p>
                            <p className="text-sm font-medium text-emerald-400">{vendedor.nombre}</p>
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

              {/* Información de Marca y Vendedor */}
              {selectedInsightForProposal.targetBrand && (
                <div className="bg-gradient-to-br from-magenta-500/10 to-purple-500/10 border border-magenta-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-magenta-500/20 border border-magenta-500/30">
                      <Building2 className="w-5 h-5 text-magenta-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Información de Marca</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Marca</p>
                      <p className="text-white font-medium">{selectedInsightForProposal.targetBrand}</p>
                    </div>
                    {selectedInsightForProposal.targetIndustry && (
                      <div>
                        <p className="text-xs text-gray-400">Industria</p>
                        <p className="text-white font-medium">{selectedInsightForProposal.targetIndustry}</p>
                      </div>
                    )}
                    {(() => {
                      const marca = MARCAS.find(m => m.nombre === selectedInsightForProposal.targetBrand);
                      if (!marca) return null;
                      const agencia = getAgenciaById(marca.agenciaId);
                      const vendedor = getVendedorByMarca(marca.id);
                      return (
                        <>
                          {agencia && (
                            <div>
                              <p className="text-xs text-gray-400">Agencia</p>
                              <p className="text-white font-medium">{isDirecto(agencia.id) ? 'Directo' : agencia.nombre}</p>
                            </div>
                          )}
                          {vendedor && (
                            <div>
                              <p className="text-xs text-gray-400">Vendedor</p>
                              <p className="text-white font-medium">{vendedor.nombre}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

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