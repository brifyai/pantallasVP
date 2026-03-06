// src/components/layout/Sidebar.tsx
import { useState, createElement, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  Map,
  MonitorPlay,
  TrendingUp,
  History,
  LogOut,
  Settings,
  X,
  HelpCircle,
  BookOpen,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  Clock,
  Download,
  Filter,
  Layers,
  Users,
  Briefcase,
  Search,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { path: '/brand', icon: BarChart2, label: 'Brand Intelligence' },
  { path: '/screen', icon: MonitorPlay, label: 'Screen Performance' },
  { path: '/geo', icon: Map, label: 'Geo Intelligence' },
  { path: '/sales', icon: TrendingUp, label: 'Sales Intelligence' },
  { path: '/time', icon: History, label: 'Time Machine' },
  { path: '/insights', icon: Lightbulb, label: 'Insights' },
  { path: '/team', icon: Users, label: 'Equipo' },
];

interface SidebarProps {
  activeView: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ activeView, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sidebarClasses = isMobileOpen
    ? 'mobile-sidebar active'
    : 'hidden md:flex w-64 h-screen border-r border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,26,0.4)] backdrop-blur-xl flex-col justify-between fixed left-0 top-0 z-50';

  return (
    <div className={sidebarClasses}>
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--accent-cyan))] to-[rgb(var(--accent-magenta))] flex items-center justify-center font-bold text-white text-xl">
              F
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-white font-black text-xl leading-none tracking-wider uppercase">
                Flesad
              </h1>
              <span className="text-[10px] text-[rgb(var(--accent-cyan))] font-bold uppercase tracking-[0.3em] mt-0.5">Analytics</span>
            </div>
          </div>
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.path}
                key={item.path}
                onClick={isMobileOpen ? onCloseMobile : undefined}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[rgba(var(--accent-cyan),0.15)] to-transparent border-l-2 border-[rgb(var(--accent-cyan))] text-white'
                      : 'text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={isActive ? 'text-[rgb(var(--accent-cyan))]' : ''} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[rgba(255,255,255,0.05)] space-y-2">
        <button
          onClick={() => setIsHelpOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[rgba(6,182,212,0.1)] hover:text-cyan-400 transition-all"
        >
          <HelpCircle size={20} />
          <span className="font-medium text-sm">Ayuda y Soporte</span>
        </button>
        <NavLink
          to="/settings"
          onClick={isMobileOpen ? onCloseMobile : undefined}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[rgba(var(--accent-cyan),0.15)] to-transparent border-l-2 border-[rgb(var(--accent-cyan))] text-white'
                : 'text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={20} className={isActive ? 'text-[rgb(var(--accent-cyan))]' : ''} />
              <span className="font-medium text-sm">Configuración</span>
            </>
          )}
        </NavLink>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-rose-400 transition-all">
          <LogOut size={20} />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>

      {/* Help Modal */}
      {isHelpOpen && typeof document !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsHelpOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a1a] border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a1a]/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <HelpCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Centro de Ayuda</h2>
                  <p className="text-xs text-gray-400">Todo lo que necesitas para usar Flesad Analytics</p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="sticky top-[73px] bg-[#0a0a1a] z-10 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en el centro de ayuda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-navy-950/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Quick Links - Always visible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="mailto:soporte@flesad.com" className="group p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Contactar Soporte</h3>
                  </div>
                  <p className="text-xs text-gray-400">soporte@flesad.com - Respondemos en menos de 24hrs</p>
                </a>
                <a href="#" className="group p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Guía de Usuario</h3>
                  </div>
                  <p className="text-xs text-gray-400">Documentación completa en PDF descargable</p>
                </a>
              </div>

              {/* Search Results Info */}
              {searchTerm && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Resultados para "<span className="text-cyan-400 font-medium">{searchTerm}</span>"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}

              {/* Guía de Inicio Rápido */}
              <HelpSection
                searchTerm={searchTerm}
                icon={Zap}
                iconColor="text-amber-400"
                title="Guía de Inicio Rápido"
                items={[
                  { title: '1. Explora el Command Center', content: 'Comienza por el panel principal para ver los KPIs en tiempo real y tener una visión general del tráfico y rendimiento de tu negocio.' },
                  { title: '2. Analiza tu Competencia', content: 'Usa Brand Intelligence para comparar el share de tráfico de diferentes marcas y entender tu posición en el mercado.' },
                  { title: '3. Encuentra la Ubicación Perfecta', content: 'Geo Intelligence te muestra el mapa de calor de Santiago para identificar las zonas de mayor tráfico según tu target.' },
                  { title: '4. Genera Propuestas con IA', content: 'Sales Intelligence crea propuestas de valor automáticas basadas en datos reales de audiencia para tus clientes.' }
                ]}
              />

              {/* Módulos de la App */}
              <HelpSection
                searchTerm={searchTerm}
                icon={LayoutDashboard}
                iconColor="text-cyan-400"
                title="Módulos de la Aplicación"
                items={[
                  { title: 'Command Center', content: 'Panel principal con KPIs en tiempo real, flujo de vehículos, y métricas clave del negocio. Incluye: KPIs principales (Ingresos, Utilidad, ROI, Ticket Promedio), Gráfico de flujo de vehículos en tiempo real, Top 5 marcas con mayor tráfico, Distribución por tipo de vehículo, Mapa de calor semanal por hora.' },
                  { title: 'Brand Intelligence', content: 'Análisis competitivo de marcas. Compara share, crecimiento y dominancia por zona. Incluye: Share de tráfico por marca, Crecimiento interanual (YoY), Dominancia por comuna, Top 10 marcas por volumen, Filtros por segmento (Premium, Mass, etc.).' },
                  { title: 'Screen Performance', content: 'Mide el rendimiento de cada pantalla individualmente. Incluye: Vehículos únicos por pantalla, Horarios peak de cada ubicación, Composición de marcas por pantalla, Comparativa entre pantallas, Métricas de retención visual.' },
                  { title: 'Geo Intelligence', content: 'Análisis geográfico avanzado con mapas de calor y distribución territorial. Incluye: Mapa interactivo de Santiago, Heatmap por densidad de tráfico, Filtros por tipo de vehículo y marca, Información detallada por comuna, Capas de transporte público.' },
                  { title: 'Sales Intelligence', content: 'Generación de insights comerciales y match de audiencias para ventas. Incluye: Alertas inteligentes de oportunidades, Audience Match (encuentra pantallas por target), Competitor Tracker (analiza competencia), Prospectos por Rubro con perfiles detallados, Generador de propuestas de valor con IA.' },
                  { title: 'Time Machine', content: 'Análisis histórico y predictivo del tráfico. Incluye: Comparación de períodos temporales, Predicción de tráfico con IA, Cápsula del tiempo (revive fechas específicas), Exportación de datos históricos, Detección de tendencias estacionales.' }
                ]}
              />

              {/* FAQ Completa */}
              <HelpSection
                searchTerm={searchTerm}
                icon={HelpCircle}
                iconColor="text-purple-400"
                title="Preguntas Frecuentes"
                items={[
                  { title: '¿Cómo se calcula el Share de Tráfico?', content: 'El Share se calcula dividiendo el número de vehículos detectados de una marca entre el total de vehículos del segmento seleccionado, multiplicado por 100. Los datos provienen de nuestros sensores en tiempo real instalados en cada pantalla.' },
                  { title: '¿Qué significa el CPM estimado?', content: 'El CPM (Costo Por Mil impresiones) estimado se calcula basándose en el volumen de tráfico detectado, la ubicación de la pantalla, el perfil socioeconómico de la zona y el tipo de vehículos que transitan por el sector.' },
                  { title: '¿Cómo usar el Audience Match?', content: 'En Sales Intelligence, selecciona el perfil de audiencia objetivo (Premium, Familiar, Joven, Masivo) y el sistema analizará los patrones de tráfico para recomendarte las 3 mejores pantallas. Cada recomendación incluye un score de match y la razón específica.' },
                  { title: '¿Los datos son en tiempo real?', content: 'Sí, nuestros sensores actualizan el tráfico cada 5 minutos. Los KPIs del Command Center y las alertas se actualizan automáticamente. Algunos análisis históricos y comparativos pueden tener un delay de 24 horas para procesamiento de datos.' },
                  { title: '¿Puedo exportar los reportes?', content: 'Sí, todos los módulos permiten exportar datos en formato CSV. También puedes generar reportes PDF personalizados con tu branding desde el botón superior de cada página.' },
                  { title: '¿Qué es la Time Machine?', content: "Time Machine es una herramienta que te permite comparar períodos temporales diferentes y predecir tráfico futuro usando IA. Incluye la 'Cápsula del Tiempo' para revivir fechas específicas y analizar tendencias estacionales." },
                  { title: '¿Cómo funciona el Competitor Tracker?', content: 'En Sales Intelligence, selecciona una marca y el sistema mostrará un gráfico comparativo del tráfico de esa marca vs sus competidores directos en diferentes pantallas. Incluye insights estratégicos para identificar oportunidades de ataque.' },
                  { title: '¿Qué son los Prospectos por Rubro?', content: 'Es una sección de Sales Intelligence que muestra 10 industrias potenciales para ofrecer publicidad OOH. Cada rubro incluye perfil cuantitativo, cualitativo, comportamiento por comuna y recomendaciones de campaña con inversión estimada.' }
                ]}
              />

              {/* Glosario de Términos */}
              <HelpSection
                searchTerm={searchTerm}
                icon={BookOpen}
                iconColor="text-purple-400"
                title="Glosario de Términos"
                items={[
                  { title: 'Share de Tráfico', content: 'Porcentaje del total de vehículos que representa una marca en un segmento específico.' },
                  { title: 'CPM', content: 'Costo Por Mil impresiones. Métrica estándar para comparar eficiencia de medios.' },
                  { title: 'Reach', content: 'Número de personas únicas expuestas a una pantalla o campaña.' },
                  { title: 'Frecuencia', content: 'Promedio de veces que una persona ve una pantalla en un período.' },
                  { title: 'YoY (Year over Year)', content: 'Comparación del mismo período entre años diferentes para medir crecimiento real.' },
                  { title: 'Heatmap', content: 'Mapa de calor que muestra densidad de tráfico con colores (rojo = alto, azul = bajo).' },
                  { title: 'Premium Area', content: 'Zona con alta concentración de vehículos de marcas premium (BMW, Mercedes, Audi, etc.).' },
                  { title: 'Commute', content: 'Trayecto habitual entre casa y trabajo. Horarios peak: 07:00-09:00 y 17:00-20:00.' }
                ]}
                isGlossary
              />

              {/* Atajos y Consejos Útiles */}
              <HelpSection
                searchTerm={searchTerm}
                icon={Clock}
                iconColor="text-cyan-400"
                title="Atajos y Consejos Útiles"
                items={[
                  { title: 'Segmenta por Tipo de Vehículo', content: 'Usa los filtros superiores para analizar tráfico por tipo: Sedán, SUV, Pick-up, etc.' },
                  { title: 'Compara Períodos', content: 'En Time Machine, compara cualquier fecha con el mismo día del año anterior para ver tendencias.' },
                  { title: 'Activa Capas en el Mapa', content: 'En Geo Intelligence, activa capas de transporte público y límites comunales para más contexto.' },
                  { title: 'Exporta Tus Datos', content: 'Todos los gráficos y tablas pueden exportarse a CSV para análisis externo en Excel o Google Sheets.' }
                ]}
              />

              {/* Contacto Soporte */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 border border-cyan-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  ¿Necesitas ayuda adicional?
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta técnica o funcional. 
                  También ofrecemos sesiones de capacitación personalizadas para tu equipo.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:soporte@flesad.com"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    soporte@flesad.com
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Solicitar Capacitación
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Horario de atención: Lunes a Viernes, 9:00 - 18:00 hrs (Chile)
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}

// Componente unificado para secciones de ayuda con búsqueda
function HelpSection({
  searchTerm,
  icon: Icon,
  iconColor,
  title,
  items,
  isGlossary = false
}: {
  searchTerm: string;
  icon: any;
  iconColor: string;
  title: string;
  items: { title: string; content: string }[];
  isGlossary?: boolean;
}) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Filtrar items basado en el término de búsqueda
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      item =>
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
    );
  }, [searchTerm, items]);

  // No mostrar la sección si no hay resultados
  if (searchTerm && filteredItems.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Icon className={cn("w-5 h-5", iconColor)} />
        {title}
      </h3>
      {isGlossary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.title}
              className="bg-navy-950/30 border border-white/5 rounded-lg p-3"
            >
              <h4 className="text-sm font-medium text-cyan-400 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-400">{item.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.title}
              className="bg-navy-950/50 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedItem(expandedItem === item.title ? null : item.title)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
              >
                <span className="font-medium text-white text-sm">{item.title}</span>
                <ChevronRight
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    expandedItem === item.title && "rotate-90"
                  )}
                />
              </button>
              {expandedItem === item.title && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <p className="text-sm text-gray-400 mt-3 leading-relaxed">{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
