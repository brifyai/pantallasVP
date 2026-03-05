// src/components/layout/Sidebar.tsx
import { useState, createElement } from 'react';
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
  Video,
  MessageCircle,
  ChevronRight,
  ExternalLink
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
];

interface SidebarProps {
  activeView: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ activeView, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="#" className="group p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Documentación</h3>
                  </div>
                  <p className="text-xs text-gray-400">Guías completas de cada módulo</p>
                </a>
                <a href="#" className="group p-4 bg-gradient-to-br from-magenta-500/10 to-purple-500/10 border border-magenta-500/20 rounded-xl hover:border-magenta-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-5 h-5 text-magenta-400" />
                    <h3 className="font-semibold text-white">Video Tutoriales</h3>
                  </div>
                  <p className="text-xs text-gray-400">Aprende viendo videos paso a paso</p>
                </a>
                <a href="#" className="group p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Soporte Técnico</h3>
                  </div>
                  <p className="text-xs text-gray-400">Contacta a nuestro equipo</p>
                </a>
              </div>

              {/* Módulos de la App */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                  Módulos de la Aplicación
                </h3>
                <div className="space-y-3">
                  <HelpModuleCard
                    icon={LayoutDashboard}
                    title="Command Center"
                    description="Panel principal con KPIs en tiempo real, flujo de vehículos, y métricas clave del negocio."
                    features={[
                      'KPIs principales: Ingresos, Utilidad, ROI, Ticket Promedio',
                      'Gráfico de flujo de vehículos en tiempo real',
                      'Top 5 marcas con mayor tráfico',
                      'Distribución por tipo de vehículo',
                      'Mapa de calor semanal por hora'
                    ]}
                  />
                  <HelpModuleCard
                    icon={BarChart2}
                    title="Brand Intelligence"
                    description="Análisis competitivo de marcas. Compara share, crecimiento y dominancia por zona."
                    features={[
                      'Share de tráfico por marca',
                      'Crecimiento interanual (YoY)',
                      'Dominancia por comuna',
                      'Top 10 marcas por volumen',
                      'Filtros por segmento (Premium, Mass, etc.)'
                    ]}
                  />
                  <HelpModuleCard
                    icon={MonitorPlay}
                    title="Screen Performance"
                    description="Mide el rendimiento de cada pantalla individualmente."
                    features={[
                      'Vehículos únicos por pantalla',
                      'Horarios peak de cada ubicación',
                      'Composición de marcas por pantalla',
                      'Comparativa entre pantallas',
                      'Métricas de retención visual'
                    ]}
                  />
                  <HelpModuleCard
                    icon={Map}
                    title="Geo Intelligence"
                    description="Análisis geográfico avanzado con mapas de calor y distribución territorial."
                    features={[
                      'Mapa interactivo de Santiago',
                      'Heatmap por densidad de tráfico',
                      'Filtros por tipo de vehículo y marca',
                      'Información detallada por comuna',
                      'Capas de transporte público'
                    ]}
                  />
                  <HelpModuleCard
                    icon={TrendingUp}
                    title="Sales Intelligence"
                    description="Generación de insights comerciales y match de audiencias para ventas."
                    features={[
                      'Alertas inteligentes de oportunidades',
                      'Audience Match: encuentra pantallas por target',
                      'Competitor Tracker: analiza competencia',
                      'Prospectos por Rubro con perfiles detallados',
                      'Generador de propuestas de valor con IA'
                    ]}
                  />
                  <HelpModuleCard
                    icon={History}
                    title="Time Machine"
                    description="Análisis histórico y predictivo del tráfico."
                    features={[
                      'Comparación de períodos temporales',
                      'Predicción de tráfico con IA',
                      'Cápsula del tiempo: revive fechas específicas',
                      'Exportación de datos históricos',
                      'Detección de tendencias estacionales'
                    ]}
                  />
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Preguntas Frecuentes</h3>
                <div className="space-y-3">
                  <FAQItem
                    question="¿Cómo se calcula el Share de Tráfico?"
                    answer="El Share se calcula dividiendo el número de vehículos detectados de una marca entre el total de vehículos del segmento seleccionado, multiplicado por 100. Los datos provienen de nuestros sensores en tiempo real."
                  />
                  <FAQItem
                    question="¿Qué significa el CPM estimado?"
                    answer="El CPM (Costo Por Mil impresiones) estimado se calcula basándose en el volumen de tráfico detectado, la ubicación de la pantalla y el perfil socioeconómico de la zona."
                  />
                  <FAQItem
                    question="¿Cómo usar el Audience Match?"
                    answer="Selecciona el perfil de audiencia objetivo (Premium, Familiar, Joven, Masivo) y el sistema te recomendará las 3 mejores pantallas basándose en los patrones de tráfico detectados."
                  />
                  <FAQItem
                    question="¿Los datos son en tiempo real?"
                    answer="Sí, nuestros sensores actualizan el tráfico cada 5 minutos. Sin embargo, algunos análisis históricos pueden tener un delay de 24 horas para procesamiento."
                  />
                  <FAQItem
                    question="¿Puedo exportar los reportes?"
                    answer="Sí, todos los módulos permiten exportar datos en formato CSV o generar reportes PDF personalizados con tu branding."
                  />
                </div>
              </div>

              {/* Contacto Soporte */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 border border-cyan-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">¿Necesitas ayuda adicional?</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta técnica o funcional.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:soporte@flesad.com"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar Email
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Chat en Vivo
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}

// Componente interno para tarjetas de módulos
function HelpModuleCard({ 
  icon: Icon, 
  title, 
  description, 
  features 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  features: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-navy-950/50 border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white">{title}</h4>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{description}</p>
        </div>
        <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform", isExpanded && "rotate-90")} />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5">
          <p className="text-sm text-gray-300 mb-3">{description}</p>
          <ul className="space-y-1.5">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Componente interno para FAQ
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-navy-950/50 border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
      >
        <span className="font-medium text-white text-sm">{question}</span>
        <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-90")} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-white/5">
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}