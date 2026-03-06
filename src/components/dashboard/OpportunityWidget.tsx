import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  ArrowRight, 
  Target, 
  X, 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  CheckCircle2,
  Zap,
  BrainCircuit,
  Copy
} from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function OpportunityWidget() {
  const [showProposal, setShowProposal] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateProposal = () => {
    setShowProposal(true);
  };

  const handleViewAnalysis = () => {
    setShowAnalysis(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Propuesta de Valor - Oportunidad Detectada por IA\n\n` +
      `Segmento Objetivo: Propietarios de vehículos premium (BMW, Audi, Mercedes)\n` +
      `Ubicación: Vitacura - Av. Kennedy\n` +
      `Horario Óptimo: Martes y Jueves 07:00-09:00 hrs\n` +
      `Audiencia Alcanzada: ~2.500 vehículos premium/semana\n` +
      `Recomendación: Campaña de seguros de cobertura completa con descuento por uso de tracker GPS`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-navy-900/50 backdrop-blur-md p-4 md:p-6 col-span-1 lg:col-span-2 border border-white/10 rounded-xl bg-gradient-to-br from-[rgba(var(--accent-magenta),0.1)] to-[rgba(var(--accent-cyan),0.05)] border-[rgba(var(--accent-magenta),0.3)] relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[rgb(var(--accent-magenta))] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        
        <div className="flex items-start gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-gradient-to-br from-[rgb(var(--accent-magenta))] to-purple-600 rounded-xl shadow-[0_0_15px_rgba(var(--accent-magenta),0.5)] flex-shrink-0">
            <Lightbulb size={20} className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 md:mb-1">
              <h2 className="text-base md:text-lg font-bold text-white">Oportunidad del Día detectada por IA</h2>
              <span className="px-2 py-0.5 rounded-full bg-[rgba(var(--accent-lime),0.2)] border border-[rgba(var(--accent-lime),0.5)] text-[rgb(var(--accent-lime))] text-[10px] md:text-xs font-semibold flex items-center gap-1 w-fit">
                <Target size={10} className="w-2.5 h-2.5 md:w-3 md:h-3" />
                Alto Potencial
              </span>
            </div>
            
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
              "Los días Martes y Jueves entre las <strong className="text-white">07:00 y 09:00 hrs</strong>, el <strong className="text-[rgb(var(--accent-cyan))]">42% de los vehículos</strong> detectados en la pantalla de <strong className="text-white border-b border-dashed border-gray-500">Vitacura (Av. Kennedy)</strong> pertenecen a marcas premium (BMW, Audi, Mercedes).
              Existe un segmento no explotado para aseguradoras de alta gama."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={handleGenerateProposal}
                className="px-3 md:px-4 py-2 bg-gradient-to-r from-[rgb(var(--accent-magenta))] to-[rgb(var(--accent-cyan))] rounded-lg text-xs md:text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_10px_rgba(var(--accent-magenta),0.4)] cursor-pointer justify-center"
              >
                <Zap size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Generar Propuesta
                <ArrowRight size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={handleViewAnalysis}
                className="px-3 md:px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-xs md:text-sm font-medium text-gray-300 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <BrainCircuit size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Ver Análisis Profundo
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Propuesta - Nivel Startup */}
      {showProposal && typeof document !== 'undefined' && createPortal(
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
            className="bg-[#0a0a1a] border border-white/20 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a1a]/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-magenta-500/20 to-cyan-500/20 rounded-xl border border-magenta-500/30">
                  <Lightbulb className="w-6 h-6 text-magenta-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Propuesta de Valor</h2>
                  <p className="text-xs text-gray-400">Generada por IA • Oportunidad Premium</p>
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
              {/* Badge de Audiencia */}
              <div className="bg-gradient-to-r from-magenta-500/10 to-purple-500/10 border border-magenta-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-magenta-400" />
                  <span className="text-xs font-medium text-gray-400">AUDIENCIA OBJETIVO</span>
                </div>
                <p className="text-lg font-semibold text-white">Propietarios de vehículos premium (BMW, Audi, Mercedes-Benz)</p>
              </div>

              {/* Grid de Datos Clave */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-medium text-gray-400">UBICACIÓN</span>
                  </div>
                  <p className="text-white font-medium">Vitacura - Av. Kennedy</p>
                </div>

                <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-medium text-gray-400">HORARIO ÓPTIMO</span>
                  </div>
                  <p className="text-white font-medium">Martes y Jueves 07:00-09:00 hrs</p>
                </div>

                <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-gray-400">AUDIENCIA ALCANZADA</span>
                  </div>
                  <p className="text-white font-medium">~2.500 vehículos premium/semana</p>
                </div>

                <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-gray-400">CONVERSIÓN ESTIMADA</span>
                  </div>
                  <p className="text-white font-medium">3.2% (industry benchmark: 1.8%)</p>
                </div>
              </div>

              {/* Recomendación Estratégica */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Recomendación Estratégica</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Campaña de <strong className="text-white">seguros de cobertura completa</strong> con descuento por uso de tracker GPS. 
                  Enfocarse en beneficios exclusivos para segmento premium: asistencia vial 24/7, vehículo de reemplazo de lujo, 
                  y cobertura extendida en el extranjero.
                </p>
              </div>

              {/* KPIs Proyectados */}
              <div className="border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">KPIs Proyectados (3 meses)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-navy-950/50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-400">156K</p>
                    <p className="text-xs text-gray-400 mt-1">Impresiones</p>
                  </div>
                  <div className="text-center p-3 bg-navy-950/50 rounded-lg">
                    <p className="text-2xl font-bold text-cyan-400">4.8K</p>
                    <p className="text-xs text-gray-400 mt-1">Leads</p>
                  </div>
                  <div className="text-center p-3 bg-navy-950/50 rounded-lg">
                    <p className="text-2xl font-bold text-magenta-400">3.2%</p>
                    <p className="text-xs text-gray-400 mt-1">Conversión</p>
                  </div>
                  <div className="text-center p-3 bg-navy-950/50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-400">$2.10</p>
                    <p className="text-xs text-gray-400 mt-1">CPA Est.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-[#0a0a1a]/95 backdrop-blur border-t border-white/10 p-6 flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Propuesta
                  </>
                )}
              </button>
              <button
                onClick={() => setShowProposal(false)}
                className="flex-1 py-3 bg-gradient-to-r from-magenta-500 to-purple-600 hover:opacity-90 text-white font-medium rounded-lg transition-opacity"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Modal Análisis Profundo - Nivel Startup */}
      {showAnalysis && typeof document !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAnalysis(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a1a] border border-white/20 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a1a]/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                  <BrainCircuit className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Análisis Profundo</h2>
                  <p className="text-xs text-gray-400">Inteligencia de Mercado • Vitacura</p>
                </div>
              </div>
              <button
                onClick={() => setShowAnalysis(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Métricas de la Ubicación */}
              <div className="border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-magenta-500/20 border border-magenta-500/30">
                    <BarChart3 className="w-5 h-5 text-magenta-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Métricas de la Ubicación</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-navy-950/50 rounded-lg">
                    <div className="p-2 rounded bg-cyan-500/20">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Tráfico Promedio</p>
                      <p className="text-lg font-bold text-white">15.000 <span className="text-xs font-normal text-gray-400">vehículos/día</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-navy-950/50 rounded-lg">
                    <div className="p-2 rounded bg-magenta-500/20">
                      <Target className="w-4 h-4 text-magenta-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Segmento Premium</p>
                      <p className="text-lg font-bold text-white">42% <span className="text-xs font-normal text-gray-400">martes/jueves AM</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-navy-950/50 rounded-lg">
                    <div className="p-2 rounded bg-amber-500/20">
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Retención Visual</p>
                      <p className="text-lg font-bold text-white">78% <span className="text-xs font-normal text-gray-400">engagement</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-navy-950/50 rounded-lg">
                    <div className="p-2 rounded bg-emerald-500/20">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Costo por Contacto</p>
                      <p className="text-lg font-bold text-white">$450 <span className="text-xs font-normal text-gray-400">CLP efectivo</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competencia en Zona */}
              <div className="border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <Target className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Competencia en Zona</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy-950/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Aseguradoras con presencia OOH</p>
                        <p className="text-xs text-gray-400">Radio 2km desde la pantalla</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Competencia Media</span>
                  </div>
                  <div className="p-3 bg-navy-950/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">PRINCIPALES COMPETIDORES</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">Seguros Chile</span>
                      <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">Consorcio</span>
                      <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">Bci Seguros</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Oportunidad Diferenciada */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <Lightbulb className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Oportunidad Diferenciada</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Enfoque en <strong className="text-white">cobertura premium con servicios exclusivos</strong>:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Asistencia vial 24/7 con grúa especializada para vehículos de lujo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Cobertura extendida en el extranjero (Argentina, Brasil, Uruguay)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Vehículo de reemplazo de categoría equivalente</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Descuento del 15% por instalación de tracker GPS certificado</span>
                  </li>
                </ul>
              </div>

              {/* Insight de IA */}
              <div className="bg-gradient-to-br from-purple-500/10 to-magenta-500/10 border border-purple-500/20 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Insight de IA</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  El análisis de patrones de tráfico revela que el <strong className="text-purple-400">68% de los vehículos premium</strong>
                  que transitan por esta zona residen en Vitacura, Lo Barnechea o Las Condes. Este segmento presenta una tasa de 
                  conversión <strong className="text-purple-400">2.3x superior</strong> al promedio cuando el mensaje se enfoca en 
                  exclusividad y servicios personalizados.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[#0a0a1a]/95 backdrop-blur border-t border-white/10 p-6">
              <button
                onClick={() => setShowAnalysis(false)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-medium rounded-lg transition-opacity"
              >
                Cerrar Análisis
              </button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </>
  );
}