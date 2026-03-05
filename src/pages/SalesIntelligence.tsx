import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Crosshair, 
  FileText,
  BarChart3,
  Target as TargetIcon,
  Lightbulb,
  TrendingUp as TrendingUpIcon,
  Check
} from 'lucide-react';
import { SCREENS, BRANDS, PREMIUM_BRANDS } from '../data/mockData';
import { cn } from '../utils/cn';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface ProposalSection {
  title: string;
  content?: string;
  items?: string[];
}

interface Proposal {
  diagnosis: ProposalSection;
  opportunity: ProposalSection;
  recommendation: ProposalSection;
  projection: ProposalSection;
}

export function SalesIntelligence() {
  const [targetAudience, setTargetAudience] = useState('premium');
  const [selectedBrand, setSelectedBrand] = useState(PREMIUM_BRANDS[0]);
  const [showProposal, setShowProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<Proposal | null>(null);
  
  // Dropdown 1: Audience Match
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const [audiencePosition, setAudiencePosition] = useState({ top: 0, left: 0, width: 0 });
  const audienceRef = useRef<HTMLDivElement>(null);

  // Dropdown 2: Competitor Tracker
  const [isCompetitorOpen, setIsCompetitorOpen] = useState(false);
  const [competitorPosition, setCompetitorPosition] = useState({ top: 0, left: 0, width: 0 });
  const competitorRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const updatePosition = (ref: React.RefObject<HTMLDivElement | null>, setPosition: (pos: { top: number; left: number; width: number }) => void) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  };

  // Audience dropdown effects
  useEffect(() => {
    if (isAudienceOpen) {
      updatePosition(audienceRef, setAudiencePosition);
      window.addEventListener('resize', () => updatePosition(audienceRef, setAudiencePosition));
      window.addEventListener('scroll', () => updatePosition(audienceRef, setAudiencePosition), true);
    }
    return () => {
      window.removeEventListener('resize', () => updatePosition(audienceRef, setAudiencePosition));
      window.removeEventListener('scroll', () => updatePosition(audienceRef, setAudiencePosition), true);
    };
  }, [isAudienceOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (audienceRef.current && !audienceRef.current.contains(event.target as Node)) {
        setIsAudienceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Competitor dropdown effects
  useEffect(() => {
    if (isCompetitorOpen) {
      updatePosition(competitorRef, setCompetitorPosition);
      window.addEventListener('resize', () => updatePosition(competitorRef, setCompetitorPosition));
      window.addEventListener('scroll', () => updatePosition(competitorRef, setCompetitorPosition), true);
    }
    return () => {
      window.removeEventListener('resize', () => updatePosition(competitorRef, setCompetitorPosition));
      window.removeEventListener('scroll', () => updatePosition(competitorRef, setCompetitorPosition), true);
    };
  }, [isCompetitorOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (competitorRef.current && !competitorRef.current.contains(event.target as Node)) {
        setIsCompetitorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const audienceOptions = [
    { value: 'premium', label: 'Segmento ABC1 / Marcas Premium' },
    { value: 'family', label: 'Familias / SUVs / Transporte Escolar' },
    { value: 'young', label: 'Jóvenes Profesionales / Universidades' },
    { value: 'massive', label: 'Masivo / Alto Volumen de Tráfico' }
  ];

  // Automated Alert System Mock
  const alerts = [
    {
      id: 1,
      type: 'opportunity',
      text: 'Nueva tendencia: aumento del 34% de vehículos eléctricos e híbridos en pantalla Vitacura.',
      icon: Zap,
      color: 'text-lime-400'
    },
    {
      id: 2,
      type: 'trend',
      text: 'Los SUV premium se concentran en pantallas Las Condes y Lo Barnechea entre 17:00-20:00 hrs.',
      icon: TrendingUp,
      color: 'text-cyan-400'
    },
    {
      id: 3,
      type: 'competitor',
      text: 'Toyota domina la ruta Providencia → Costanera Norte con un 22% del flujo total en horario AM.',
      icon: Crosshair,
      color: 'text-magenta-400'
    }
  ];

  // Audience Matcher Mock Logic
  const getAudienceMatch = () => {
    switch (targetAudience) {
      case 'premium':
        return SCREENS.filter(s => s.isPremiumArea).slice(0, 3).map(s => ({
          ...s,
          score: 95 - Math.random() * 10,
          reason: 'Alta concentración de marcas lujo (BMW, Mercedes) y vehículos 2020+.'
        }));
      case 'family':
        return SCREENS.filter(s => ['Maipú', 'La Florida', 'Puente Alto'].includes(s.commune)).slice(0, 3).map(s => ({
          ...s,
          score: 88 - Math.random() * 10,
          reason: 'Gran volumen de SUVs familiares y alto flujo en horarios de colegio (07:30 y 16:00).'
        }));
      case 'young':
        return SCREENS.filter(s => ['Providencia', 'Ñuñoa', 'Santiago Centro'].includes(s.commune)).slice(0, 3).map(s => ({
          ...s,
          score: 92 - Math.random() * 10,
          reason: 'Fuerte presencia de Hatchbacks recientes, zona universitaria y polos gastronómicos.'
        }));
      default:
        return SCREENS.slice(0, 3).map(s => ({
          ...s,
          score: 85 - Math.random() * 10,
          reason: 'Volumen masivo de tráfico estable durante todo el día.'
        }));
    }
  };

  const matchedScreens = getAudienceMatch();

  // Competitor Tracker Logic
  const getCompetitors = () => {
    const isPremium = PREMIUM_BRANDS.includes(selectedBrand);
    const pool = isPremium ? PREMIUM_BRANDS : BRANDS.filter(b => !PREMIUM_BRANDS.includes(b));
    const competitors = pool.filter(b => b !== selectedBrand).slice(0, 2);
    return competitors;
  };
  
  const competitors = getCompetitors();
  
  // Generar propuesta de valor
  const handleGenerateProposal = () => {
    const proposals: Record<string, Proposal> = {
      premium: {
        diagnosis: {
          title: 'Diagnóstico de Audiencia Premium',
          content: 'Nuestros sensores detectan una concentración del <strong>35% de vehículos premium</strong> (BMW, Mercedes-Benz, Audi) en las pantallas de Las Condes y Vitacura, con un valor promedio de mercado superior a UF 2.500.'
        },
        opportunity: {
          title: 'Oportunidad Identificada',
          items: [
            'Horario peak: <strong>17:00 - 20:00 hrs</strong> con mayor concentración ABC1',
            'Las Condes registra <strong>2.340 vehículos premium/día</strong>',
            'Vitacura presenta <strong>42% de SUVs premium</strong> sobre el promedio'
          ]
        },
        recommendation: {
          title: 'Recomendación Estratégica',
          content: 'Pautar en <strong>Pantalla Las Condes (Av. Apoquindo 12.450)</strong> y <strong>Pantalla Vitacura (Los Militares 4.890)</strong> durante el bloque tarde (15:00-21:00 hrs). Esta combinación alcanza al <strong>78% de tu audiencia objetivo</strong> con un CPM estimado de $3.200.'
        },
        projection: {
          title: 'Proyección de Impacto',
          content: 'Esperamos <strong>156.000 impresiones semanales</strong> con un 34% de recordación de marca y un incremento del 12% en tráfico web desde zonas objetivo.'
        }
      },
      family: {
        diagnosis: {
          title: 'Diagnóstico de Audiencia Familiar',
          content: 'Identificamos un patrón consistente de <strong>vehículos SUV y familiares</strong> en corredores de Maipú, La Florida y Puente Alto, con picos sincronizados con horarios escolares (07:00-08:30 y 15:30-17:00 hrs).'
        },
        opportunity: {
          title: 'Oportunidad Identificada',
          items: [
            'Maipú concentra <strong>4.120 SUVs/día</strong> en rutas cercanas a colegios',
            'La Florida registra <strong>67% de vehículos con sistema de anclaje infantil</strong>',
            'Horario de mayor engagement: <strong>16:00 - 18:00 hrs</strong>'
          ]
        },
        recommendation: {
          title: 'Recomendación Estratégica',
          content: 'Activar <strong>Pantalla Maipú (Av. Pajaritos 2.890)</strong> y <strong>Pantalla La Florida (Vicuña Mackenna 8.450)</strong> en bloques mañana y tarde. Mensaje enfocado en seguridad, espacio y conectividad familiar.'
        },
        projection: {
          title: 'Proyección de Impacto',
          content: 'Proyectamos <strong>234.000 impresiones semanales</strong> con 41% de recordación y un incremento del 18% en visitas a puntos de venta en zonas objetivo.'
        }
      },
      young: {
        diagnosis: {
          title: 'Diagnóstico de Audiencia Joven Profesional',
          content: 'Detectamos alta densidad de <strong>vehículos compactos y hatchbacks</strong> (2018+) en Providencia, Ñuñoa y Santiago Centro, correlacionado con zonas universitarias y de oficinas tech.'
        },
        opportunity: {
          title: 'Oportunidad Identificada',
          items: [
            'Providencia registra <strong>3.890 vehículos 2020+</strong> en horario 08:00-10:00 hrs',
            'Ñuñoa presenta <strong>52% de conductores 25-35 años</strong>',
            'Santiago Centro concentra tráfico universitario: <strong>12.400 vehículos/día</strong>'
          ]
        },
        recommendation: {
          title: 'Recomendación Estratégica',
          content: 'Pautar en <strong>Pantalla Providencia (Pedro de Valdivia 1.670)</strong> y <strong>Pantalla Ñuñoa (Irarrázaval 3.450)</strong> durante bloques de commuting. Mensaje enfocado en tecnología, diseño y sustentabilidad.'
        },
        projection: {
          title: 'Proyección de Impacto',
          content: 'Esperamos <strong>189.000 impresiones semanales</strong> con 38% de recordación y un 24% de incremento en engagement digital (QR/scans).'
        }
      },
      massive: {
        diagnosis: {
          title: 'Diagnóstico de Audiencia Masiva',
          content: 'Nuestras pantallas en ejes estratégicos de Santiago registran un flujo combinado de <strong>89.000 vehículos/día</strong>, con distribución equilibrada en segmentos y horarios extendidos.'
        },
        opportunity: {
          title: 'Oportunidad Identificada',
          items: [
            'Costanera Norte / Vespucio: <strong>34.200 vehículos/día</strong>',
            'Eje Norte-Sur: <strong>28.900 vehículos/día</strong>',
            'Horario de máximo reach: <strong>07:30 - 09:30 y 17:30 - 19:30 hrs</strong>'
          ]
        },
        recommendation: {
          title: 'Recomendación Estratégica',
          content: 'Activar paquete masivo en <strong>5 pantallas de alto flujo</strong> (Las Condes, Providencia, Santiago Centro, Maipú, La Florida) con rotación 24hrs. Ideal para lanzamientos y campañas de awareness.'
        },
        projection: {
          title: 'Proyección de Impacto',
          content: 'Proyectamos <strong>623.000 impresiones semanales</strong> con un CPM de $1.800 y reach estimado del 34% en RM.'
        }
      }
    };

    setGeneratedProposal(proposals[targetAudience] || proposals.premium);
    setShowProposal(true);
  };

  const competitorData = [
    {
      screen: 'Las Condes',
      [selectedBrand]: Math.floor(Math.random() * 300) + 200,
      [competitors[0]]: Math.floor(Math.random() * 300) + 150,
      [competitors[1]]: Math.floor(Math.random() * 300) + 100,
    },
    {
      screen: 'Providencia',
      [selectedBrand]: Math.floor(Math.random() * 200) + 150,
      [competitors[0]]: Math.floor(Math.random() * 250) + 100,
      [competitors[1]]: Math.floor(Math.random() * 200) + 120,
    },
    {
      screen: 'Vitacura',
      [selectedBrand]: Math.floor(Math.random() * 250) + 150,
      [competitors[0]]: Math.floor(Math.random() * 200) + 180,
      [competitors[1]]: Math.floor(Math.random() * 180) + 140,
    },
    {
      screen: 'Santiago Centro',
      [selectedBrand]: Math.floor(Math.random() * 150) + 50,
      [competitors[0]]: Math.floor(Math.random() * 180) + 80,
      [competitors[1]]: Math.floor(Math.random() * 160) + 70,
    }
  ];

  const getProposalText = (proposal: Proposal) => {
    return `${proposal.diagnosis.title}: ${proposal.diagnosis.content}\n\n${proposal.opportunity.title}:\n${proposal.opportunity.items?.join('\n')}\n\n${proposal.recommendation.title}: ${proposal.recommendation.content}\n\n${proposal.projection.title}: ${proposal.projection.content}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Sales Intelligence
          </h1>
          <p className="text-gray-400 mt-1">Generación de insights comerciales y match de audiencias.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors">
          <FileText className="w-4 h-4" />
          Generar Reporte PDF
        </button>
      </div>

      {/* Smart Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/5 relative overflow-hidden group"
          >
            <div className={cn("absolute top-0 left-0 w-1 h-full", 
              alert.type === 'opportunity' ? 'bg-lime-500' : 
              alert.type === 'trend' ? 'bg-cyan-500' : 'bg-magenta-500'
            )} />
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg bg-white/5", alert.color)}>
                <alert.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white capitalize mb-1">
                  {alert.type === 'opportunity' ? 'Oportunidad' : alert.type === 'trend' ? 'Tendencia' : 'Alerta Competencia'}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{alert.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Matcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-navy-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-magenta-500/20 rounded-lg">
              <Target className="w-5 h-5 text-magenta-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Audience Match</h2>
              <p className="text-xs text-gray-400">Encuentra las mejores pantallas para tu target ideal.</p>
            </div>
          </div>

          <div className="mb-6" ref={audienceRef}>
            <label className="block text-sm font-medium text-gray-400 mb-2">Selecciona Perfil de Audiencia</label>
            <div
              onClick={() => setIsAudienceOpen(!isAudienceOpen)}
              className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white cursor-pointer flex items-center justify-between transition-all hover:border-magenta-500/50"
            >
              <span>{audienceOptions.find(o => o.value === targetAudience)?.label}</span>
              <motion.div
                animate={{ rotate: isAudienceOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-magenta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
            
            {isAudienceOpen && createPortal(
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'fixed',
                  top: audiencePosition.top,
                  left: audiencePosition.left,
                  width: audiencePosition.width,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: 'rgba(20, 25, 40, 0.95)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  zIndex: 99999,
                }}
              >
                {audienceOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setTargetAudience(option.value);
                      setIsAudienceOpen(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: targetAudience === option.value
                        ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                        : 'transparent',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      if (targetAudience !== option.value) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (targetAudience !== option.value) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </motion.div>,
              document.body
            )}
          </div>

          <div className="space-y-4 flex-1">
            <h3 className="text-sm font-medium text-gray-300">Pantallas Sugeridas (Top 3)</h3>
            {matchedScreens.map((screen) => (
              <div key={screen.id} className="bg-navy-950 p-4 rounded-lg border border-white/5 flex items-start gap-4">
                <div className="flex flex-col items-center justify-center p-2 bg-navy-800 rounded-lg min-w-[60px]">
                  <span className="text-xl font-bold text-magenta-400">{screen.score.toFixed(0)}</span>
                  <span className="text-[10px] text-gray-400 uppercase">Match</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {screen.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{screen.reason}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleGenerateProposal}
            className="w-full mt-6 py-3 bg-magenta-500 hover:bg-magenta-600 text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(255,0,229,0.3)] flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Generar Propuesta de Valor
          </button>

          {/* Modal de Propuesta Generada */}
          {showProposal && generatedProposal && typeof document !== 'undefined' && createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998] flex items-center justify-center p-4"
              onClick={() => setShowProposal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a1a] border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-magenta-500/20 rounded-xl">
                      <FileText className="w-6 h-6 text-magenta-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Propuesta de Valor</h3>
                      <p className="text-xs text-gray-400">Generada con IA basada en datos de audiencia</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProposal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="bg-magenta-500/10 border border-magenta-500/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-300 mb-2">Audiencia Seleccionada:</p>
                    <p className="text-lg font-semibold text-magenta-400">
                      {audienceOptions.find(o => o.value === targetAudience)?.label}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Diagnóstico */}
                    <div className="bg-navy-950/50 border border-white/10 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <BarChart3 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-semibold">{generatedProposal.diagnosis.title}</h4>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: generatedProposal.diagnosis.content || '' }} />
                    </div>

                    {/* Oportunidad */}
                    <div className="bg-navy-950/50 border border-white/10 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-magenta-500/10 border border-magenta-500/20">
                          <TargetIcon className="w-5 h-5 text-magenta-400" />
                        </div>
                        <h4 className="text-white font-semibold">{generatedProposal.opportunity.title}</h4>
                      </div>
                      <ul className="space-y-2">
                        {generatedProposal.opportunity.items?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-magenta-400 mt-2 flex-shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recomendación */}
                    <div className="bg-navy-950/50 border border-white/10 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <Lightbulb className="w-5 h-5 text-amber-400" />
                        </div>
                        <h4 className="text-white font-semibold">{generatedProposal.recommendation.title}</h4>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: generatedProposal.recommendation.content || '' }} />
                    </div>

                    {/* Proyección */}
                    <div className="bg-navy-950/50 border border-white/10 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <TrendingUpIcon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-semibold">{generatedProposal.projection.title}</h4>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: generatedProposal.projection.content || '' }} />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getProposalText(generatedProposal));
                      }}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Copiar Propuesta
                    </button>
                    <button
                      onClick={() => setShowProposal(false)}
                      className="flex-1 py-3 bg-magenta-500 hover:bg-magenta-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
        </motion.div>

        {/* Competitor Tracker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-navy-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Crosshair className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Competitor Tracker</h2>
              <p className="text-xs text-gray-400">Analiza el tráfico de la competencia para atacar.</p>
            </div>
          </div>

          <div className="mb-6" ref={competitorRef}>
            <label className="block text-sm font-medium text-gray-400 mb-2">Marca del Anunciante</label>
            <div
              onClick={() => setIsCompetitorOpen(!isCompetitorOpen)}
              className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white cursor-pointer flex items-center justify-between transition-all hover:border-cyan-500/50"
            >
              <span>{selectedBrand}</span>
              <motion.div
                animate={{ rotate: isCompetitorOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
            
            {isCompetitorOpen && createPortal(
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'fixed',
                  top: competitorPosition.top,
                  left: competitorPosition.left,
                  width: competitorPosition.width,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: 'rgba(20, 25, 40, 0.95)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  zIndex: 99999,
                }}
              >
                {PREMIUM_BRANDS.map((brand) => (
                  <div
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setIsCompetitorOpen(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: selectedBrand === brand
                        ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)'
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
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />
                {BRANDS.filter(b => !PREMIUM_BRANDS.includes(b)).map((brand) => (
                  <div
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setIsCompetitorOpen(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: selectedBrand === brand
                        ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)'
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

          <div className="mb-4">
            <p className="text-sm text-gray-300">
              Competidores directos detectados: 
              <span className="text-cyan-400 ml-2 font-medium">{competitors.join(' y ')}</span>
            </p>
          </div>

          <div className="flex-1 min-h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={competitorData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="screen" 
                  stroke="#ffffff50" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff50" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    borderColor: '#ffffff20',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
                  labelStyle={{ color: '#00e5ff', fontWeight: 600, marginBottom: '4px' }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Bar dataKey={selectedBrand} name={`${selectedBrand} (Tú)`} fill="#00e5ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey={competitors[0]} fill="#ff00e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey={competitors[1]} fill="#ffffff50" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-4 bg-navy-950 border border-cyan-500/20 rounded-lg">
            <p className="text-xs text-gray-300">
              <span className="text-cyan-400 font-semibold mr-1">💡 Insight Estratégico:</span>
              La marca {competitors[0]} te supera en Vitacura. Te recomendamos pautar en la <strong>Pantalla Vitacura</strong> durante la tarde para interceptar a tu audiencia compartida.
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}