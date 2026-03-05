import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, BarChart3, MapPin, TrendingUp, Clock, Car, Target, DollarSign, Settings } from 'lucide-react';

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    {
      icon: BarChart3,
      title: "Dashboard",
      color: "text-cyan-400",
      content: `El Dashboard es la vista principal de la aplicación. Muestra métricas clave en tiempo real:

• KPIS: Total de detecciones, pantallas activas, vehículos únicos y detecciones hoy
• Flujo Horario: Gráfico de área mostrando detecciones por hora (últimas 24h)
• Top 5 Marcas: Distribución de las 5 marcas más detectadas
• Tipos de Vehículos: Segmentación por tipo (Sedán, SUV, Camioneta, Hatchback)
• Mapa de Calor Semanal: Días y horas de mayor actividad
• Oportunidades: Pantallas con mejor potencial publicitario`
    },
    {
      icon: Target,
      title: "Brand Intelligence",
      color: "text-magenta-400",
      content: `Análisis profundo de comportamiento por marca de vehículo:

• Selector de Marca: Elige entre BMW, Mercedes, Audi, Toyota, etc.
• Detecciones (24h): Total de vehículos de la marca seleccionada
• Pantalla Principal: Ubicación con más detecciones de esa marca
• Hora Peak: Hora con mayor circulación
• Alta Afinidad: Marca con mayor correlación de circulación
• Flujo por Hora: Gráfico de área con distribución horaria
• Antigüedad del Parque: Distribución por año del vehículo
• Heatmap Geográfico: Mapa con detecciones por pantalla`
    },
    {
      icon: MapPin,
      title: "Geo Intelligence",
      color: "text-lime-400",
      content: `Análisis geográfico del valor publicitario por ubicación:

• Mapa Interactivo: Pantallas representadas por círculos de colores
  - Verde: Alto valor (>70 Score)
  - Amarillo: Valor medio (40-70 Score)
  - Rojo: Bajo valor (<40 Score)
• Ad Score: Puntaje 0-100 basado en volumen y ratio premium
• Información de Pantalla: Al hacer clic, muestra nombre, comuna, Ad Score y estado`
    },
    {
      icon: DollarSign,
      title: "Sales Intelligence",
      color: "text-yellow-400",
      content: `Herramienta de ventas para identificar oportunidades:

• Segmentos de Mercado: SUV, Hatchback, Sedán, Lujo
• Match Score: Porcentaje de compatibilidad de cada pantalla con el segmento
• Volumen y Ratio Premium: Métricas clave para cada pantalla
• Recomendaciones: Razón específica de por qué una pantalla es buena para un segmento`
    },
    {
      icon: Clock,
      title: "Screen Performance",
      color: "text-cyan-400",
      content: `Monitoreo del rendimiento de cada pantalla:

• Lista de Pantallas: Todas las pantallas con su Ad Score
• Ad Score: Puntaje de valor publicitario (0-100)
  - Verde (70-100): Alto valor
  - Cyan (40-69): Valor medio
  - Magenta (0-39): Bajo valor
• Detalle de Pantalla: Al seleccionar, muestra información completa, gráfico de flujo horario y recomendaciones de anunciantes ideales`
    },
    {
      icon: Car,
      title: "Time Machine",
      color: "text-magenta-400",
      content: `Análisis histórico y comparativo de datos:

• Eficiencia Ad Score: Puntaje global de eficiencia (84/100)
• Comparación de períodos: Permite analizar tendencias temporales
• Datos históricos: Evolución de detecciones y métricas en el tiempo`
    },
    {
      icon: Settings,
      title: "Settings",
      color: "text-slate-400",
      content: `Configuración de la aplicación:

• Preferencias de visualización
• Configuración de notificaciones
• Gestión de usuario y permisos
• Integraciones y API`
    }
  ];

  const howItWorks = `
La aplicación de Inteligencia Vehicular procesa datos de cámaras con IA que detectan:

1. **Captura de Datos**: Cámaras en ubicaciones estratégicas capturan imágenes de vehículos
2. **Procesamiento con IA**: Algoritmos identifican marca, modelo, año y tipo de vehículo
3. **Análisis en Tiempo Real**: Los datos se procesan y visualizan inmediatamente
4. **Métricas Derivadas**: 
   - Ad Score: Combina volumen de tráfico (40%) y ratio de vehículos premium (60%)
   - Afinidad entre marcas: Correlación de circulación simultánea
   - Heatmaps: Densidad geográfica y temporal de detecciones

**Fórmula del Ad Score:**
Ad Score = (Volumen Score × 0.4) + (Premium Ratio × 100 × 0.6)

Donde:
- Volumen Score: Normalizado según capacidad máxima de la pantalla
- Premium Ratio: Proporción de marcas premium (BMW, Mercedes, Audi, etc.)
`;

  return (
    <>
      {/* Botón de Ayuda */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-400 hover:to-magenta-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Ayuda"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[rgba(10,10,26,0.95)] backdrop-blur-xl border border-white/10 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden pointer-events-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Centro de Ayuda</h2>
                    <p className="text-slate-400 text-sm mt-1">Guía completa de la aplicación</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
                  {/* Cómo Funciona */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      ¿Cómo Funciona?
                    </h3>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                        {howItWorks}
                      </pre>
                    </div>
                  </div>

                  {/* Secciones */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">Módulos de la Aplicación</h3>
                    {sections.map((section, index) => (
                      <div
                        key={section.title}
                        className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <section.icon className={`w-5 h-5 ${section.color}`} />
                          <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                        </div>
                        <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {section.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}