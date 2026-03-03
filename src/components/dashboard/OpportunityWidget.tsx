import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Target, X } from 'lucide-react';
import { useState } from 'react';

export function OpportunityWidget() {
  const [showProposal, setShowProposal] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleGenerateProposal = () => {
    setShowProposal(true);
  };

  const handleViewAnalysis = () => {
    setShowAnalysis(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-navy-900/50 backdrop-blur-md p-6 col-span-1 lg:col-span-2 border border-white/10 rounded-xl bg-gradient-to-br from-[rgba(var(--accent-magenta),0.1)] to-[rgba(var(--accent-cyan),0.05)] border-[rgba(var(--accent-magenta),0.3)] relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[rgb(var(--accent-magenta))] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-[rgb(var(--accent-magenta))] to-purple-600 rounded-xl shadow-[0_0_15px_rgba(var(--accent-magenta),0.5)] flex-shrink-0">
            <Lightbulb size={24} className="text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-white">Oportunidad del Día detectada por IA</h2>
              <span className="px-2 py-0.5 rounded-full bg-[rgba(var(--accent-lime),0.2)] border border-[rgba(var(--accent-lime),0.5)] text-[rgb(var(--accent-lime))] text-xs font-semibold flex items-center gap-1">
                <Target size={12} />
                Alto Potencial
              </span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              "Los días Martes y Jueves entre las <strong className="text-white">07:00 y 09:00 hrs</strong>, el <strong className="text-[rgb(var(--accent-cyan))]">42% de los vehículos</strong> detectados en la pantalla de <strong className="text-white border-b border-dashed border-gray-500">Vitacura (Av. Kennedy)</strong> pertenecen a marcas premium (BMW, Audi, Mercedes).
              Existe un segmento no explotado para aseguradoras de alta gama."
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleGenerateProposal}
                className="px-4 py-2 bg-gradient-to-r from-[rgb(var(--accent-magenta))] to-[rgb(var(--accent-cyan))] rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_10px_rgba(var(--accent-magenta),0.4)] cursor-pointer"
              >
                Generar Propuesta
                <ArrowRight size={16} />
              </button>
              <button
                onClick={handleViewAnalysis}
                className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm font-medium text-gray-300 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              >
                Ver Análisis Profundo
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Propuesta */}
      {showProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 max-w-2xl w-full mx-4 relative"
          >
            <button
              onClick={() => setShowProposal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Propuesta de Valor Generada</h2>
            <div className="text-gray-300 space-y-4">
              <p><strong className="text-[rgb(var(--accent-cyan))]">Segmento Objetivo:</strong> Propietarios de vehículos premium (BMW, Audi, Mercedes)</p>
              <p><strong className="text-[rgb(var(--accent-cyan))]">Ubicación:</strong> Vitacura - Av. Kennedy</p>
              <p><strong className="text-[rgb(var(--accent-cyan))]">Horario Óptimo:</strong> Martes y Jueves 07:00-09:00 hrs</p>
              <p><strong className="text-[rgb(var(--accent-cyan))]">Audiencia Alcanzada:</strong> ~2,500 vehículos premium/semana</p>
              <p><strong className="text-[rgb(var(--accent-cyan))]">Recomendación:</strong> Campaña de seguros de cobertura completa con descuento por uso de tracker GPS</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Análisis */}
      {showAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 max-w-2xl w-full mx-4 relative"
          >
            <button
              onClick={() => setShowAnalysis(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Análisis Profundo</h2>
            <div className="text-gray-300 space-y-4">
              <p><strong className="text-[rgb(var(--accent-magenta))]">Métricas de la Ubicación:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tráfico promedio: 15,000 vehículos/día</li>
                <li>Porcentaje premium: 42% (martes/jueves mañana)</li>
                <li>Tasa de retención visual: 78%</li>
                <li>Costo por contacto efectivo: $450</li>
              </ul>
              <p><strong className="text-[rgb(var(--accent-magenta))]">Competencia en Zona:</strong> 3 aseguradoras competidoras con presencia OOH</p>
              <p><strong className="text-[rgb(var(--accent-magenta))]">Oportunidad Diferenciada:</strong> Enfoque en cobertura premium con servicios adicionales (asistencia vial 24/7, cobertura en extranjero)</p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}