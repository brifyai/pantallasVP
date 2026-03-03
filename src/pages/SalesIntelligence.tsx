import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Crosshair, 
  FileText 
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

export function SalesIntelligence() {
  const [targetAudience, setTargetAudience] = useState('premium');
  const [selectedBrand, setSelectedBrand] = useState(PREMIUM_BRANDS[0]);
  
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
            {/* Custom Dropdown Button */}
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
            
            {/* Dropdown Options - Using Portal */}
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
          
          <button className="w-full mt-6 py-3 bg-magenta-500 hover:bg-magenta-600 text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(255,0,229,0.3)]">
            Generar Propuesta de Valor
          </button>
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
            {/* Custom Dropdown Button */}
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
            
            {/* Dropdown Options - Using Portal */}
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
