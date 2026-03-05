// src/pages/Team.tsx
import { useState } from 'react';
import {
  Users,
  TrendingUp,
  Target,
  Briefcase,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  Star,
  Award,
  Lightbulb,
  ShoppingCart,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

// Tipos de datos
interface Cliente {
  id: string;
  nombre: string;
  rubro: string;
  inversion: number;
  pantallas: string[];
  fechaInicio: string;
  estado: 'activo' | 'prospecto' | 'inactivo';
  contacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
  historial: {
    campana: string;
    periodo: string;
    inversion: number;
    resultado: string;
  }[];
}

interface Vendedor {
  id: string;
  nombre: string;
  cargo: 'Director' | 'Supervisor' | 'Vendedor';
  avatar: string;
  email: string;
  telefono: string;
  metaMensual: number;
  ventasActuales: number;
  clientes: Cliente[];
  especialidad: string;
  region: string;
}

// Datos mock del equipo
const EQUIPO_DATA: Vendedor[] = [
  {
    id: '1',
    nombre: 'Roberto Fernández',
    cargo: 'Director',
    avatar: '👔',
    email: 'roberto.fernandez@flesad.com',
    telefono: '+56 9 1234 5678',
    metaMensual: 0,
    ventasActuales: 0,
    especialidad: 'Estrategia Global',
    region: 'Santiago Metropolitana',
    clientes: []
  },
  {
    id: '2',
    nombre: 'Carolina Muñoz',
    cargo: 'Supervisor',
    avatar: '👩‍💼',
    email: 'carolina.munoz@flesad.com',
    telefono: '+56 9 2345 6789',
    metaMensual: 0,
    ventasActuales: 0,
    especialidad: 'Coordinación de Equipos',
    region: 'Santiago Metropolitana',
    clientes: []
  },
  {
    id: '3',
    nombre: 'Andrés Silva',
    cargo: 'Vendedor',
    avatar: '👨‍💼',
    email: 'andres.silva@flesad.com',
    telefono: '+56 9 3456 7890',
    metaMensual: 15000000,
    ventasActuales: 12500000,
    especialidad: 'Retail y Consumo Masivo',
    region: 'Santiago Norte',
    clientes: [
      {
        id: 'c1',
        nombre: 'Supermercados Tottus',
        rubro: 'Retail',
        inversion: 4500000,
        pantallas: ['P-001 Las Condes', 'P-015 Vitacura', 'P-023 La Dehesa'],
        fechaInicio: '2025-01-15',
        estado: 'activo',
        contacto: {
          nombre: 'María González',
          email: 'mgonzalez@tottus.cl',
          telefono: '+56 2 2345 6789'
        },
        historial: [
          { campana: 'Ofertas Verano', periodo: 'Ene-Mar 2025', inversion: 4500000, resultado: '+23% tráfico en tiendas' },
          { campana: 'Vuelta al Cole', periodo: 'Feb 2025', inversion: 2000000, resultado: '+18% conversión' }
        ]
      },
      {
        id: 'c2',
        nombre: 'Banco Santander',
        rubro: 'Finanzas',
        inversion: 8000000,
        pantallas: ['P-002 Providencia', 'P-008 Santiago Centro', 'P-012 Huechuraba'],
        fechaInicio: '2024-11-01',
        estado: 'activo',
        contacto: {
          nombre: 'Carlos Ruiz',
          email: 'cruiz@santander.cl',
          telefono: '+56 2 2456 7890'
        },
        historial: [
          { campana: 'Crédito Hipotecario', periodo: 'Nov 2024-Feb 2025', inversion: 8000000, resultado: '+35% solicitudes' }
        ]
      }
    ]
  },
  {
    id: '4',
    nombre: 'Patricia Torres',
    cargo: 'Vendedor',
    avatar: '👩‍💼',
    email: 'patricia.torres@flesad.com',
    telefono: '+56 9 4567 8901',
    metaMensual: 15000000,
    ventasActuales: 18200000,
    especialidad: 'Automotriz',
    region: 'Santiago Sur',
    clientes: [
      {
        id: 'c3',
        nombre: 'Chevrolet Chile',
        rubro: 'Automotriz',
        inversion: 9500000,
        pantallas: ['P-005 La Florida', 'P-018 Puente Alto', 'P-021 La Cisterna'],
        fechaInicio: '2025-02-01',
        estado: 'activo',
        contacto: {
          nombre: 'Jorge Valenzuela',
          email: 'jvalenzuela@chevrolet.cl',
          telefono: '+56 2 2567 8901'
        },
        historial: [
          { campana: 'Nuevo Onix', periodo: 'Feb-Mar 2025', inversion: 9500000, resultado: '+42% test drives' }
        ]
      },
      {
        id: 'c4',
        nombre: 'Falabella',
        rubro: 'Retail',
        inversion: 8700000,
        pantallas: ['P-003 Las Condes', 'P-010 Ñuñoa', 'P-019 La Florida'],
        fechaInicio: '2024-12-01',
        estado: 'activo',
        contacto: {
          nombre: 'Andrea Soto',
          email: 'asoto@falabella.cl',
          telefono: '+56 2 2678 9012'
        },
        historial: [
          { campana: 'Cyber Monday', periodo: 'Nov 2024', inversion: 5000000, resultado: '+56% ventas online' },
          { campana: 'Día de la Madre', periodo: 'May 2025', inversion: 8700000, resultado: '+31% tráfico tiendas' }
        ]
      }
    ]
  },
  {
    id: '5',
    nombre: 'Miguel Ángel Castro',
    cargo: 'Vendedor',
    avatar: '👨‍💼',
    email: 'miguel.castro@flesad.com',
    telefono: '+56 9 5678 9012',
    metaMensual: 15000000,
    ventasActuales: 9800000,
    especialidad: 'Tecnología y Telecomunicaciones',
    region: 'Santiago Oriente',
    clientes: [
      {
        id: 'c5',
        nombre: 'Movistar Chile',
        rubro: 'Telecomunicaciones',
        inversion: 6500000,
        pantallas: ['P-007 Vitacura', 'P-014 Las Condes', 'P-025 La Dehesa'],
        fechaInicio: '2025-01-20',
        estado: 'activo',
        contacto: {
          nombre: 'Fernanda Morales',
          email: 'fmorales@movistar.cl',
          telefono: '+56 2 2789 0123'
        },
        historial: [
          { campana: '5G Hogar', periodo: 'Ene-Mar 2025', inversion: 6500000, resultado: '+28% contrataciones' }
        ]
      },
      {
        id: 'c6',
        nombre: 'Samsung Electronics',
        rubro: 'Tecnología',
        inversion: 3300000,
        pantallas: ['P-009 Providencia', 'P-016 Santiago Centro'],
        fechaInicio: '2025-03-01',
        estado: 'activo',
        contacto: {
          nombre: 'Ricardo Peña',
          email: 'rpena@samsung.cl',
          telefono: '+56 2 2890 1234'
        },
        historial: [
          { campana: 'Galaxy S25 Launch', periodo: 'Mar 2025', inversion: 3300000, resultado: '+45% pre-ventas' }
        ]
      }
    ]
  },
  {
    id: '6',
    nombre: 'Daniela Rojas',
    cargo: 'Vendedor',
    avatar: '👩‍💼',
    email: 'daniela.rojas@flesad.com',
    telefono: '+56 9 6789 0123',
    metaMensual: 15000000,
    ventasActuales: 14100000,
    especialidad: 'Salud y Farmacias',
    region: 'Santiago Poniente',
    clientes: [
      {
        id: 'c7',
        nombre: 'Cruz Verde',
        rubro: 'Farmacia',
        inversion: 7800000,
        pantallas: ['P-004 Maipú', 'P-011 Quilicura', 'P-020 Pudahuel'],
        fechaInicio: '2024-10-15',
        estado: 'activo',
        contacto: {
          nombre: 'Luis Herrera',
          email: 'lherrera@cruzverde.cl',
          telefono: '+56 2 2901 2345'
        },
        historial: [
          { campana: 'Campaña Invierno', periodo: 'Jun-Ago 2024', inversion: 5000000, resultado: '+22% ventas antigripales' },
          { campana: 'Día del Niño', periodo: 'Ago 2024', inversion: 7800000, resultado: '+35% categoría infantil' }
        ]
      },
      {
        id: 'c8',
        nombre: 'Clínica Alemana',
        rubro: 'Salud',
        inversion: 6300000,
        pantallas: ['P-006 Vitacura', 'P-013 Las Condes', 'P-024 La Reina'],
        fechaInicio: '2025-02-10',
        estado: 'activo',
        contacto: {
          nombre: 'Patricia Vargas',
          email: 'pvargas@alemana.cl',
          telefono: '+56 2 3012 3456'
        },
        historial: [
          { campana: 'Check-up Preventivo', periodo: 'Mar-May 2025', inversion: 6300000, resultado: '+40% agendamientos' }
        ]
      }
    ]
  },
  {
    id: '7',
    nombre: 'Rodrigo Méndez',
    cargo: 'Vendedor',
    avatar: '👨‍💼',
    email: 'rodrigo.mendez@flesad.com',
    telefono: '+56 9 7890 1234',
    metaMensual: 15000000,
    ventasActuales: 7200000,
    especialidad: 'Educación y Universidades',
    region: 'Santiago Centro',
    clientes: [
      {
        id: 'c9',
        nombre: 'Universidad de Chile',
        rubro: 'Educación',
        inversion: 4200000,
        pantallas: ['P-017 Santiago Centro', 'P-022 Ñuñoa', 'P-026 Providencia'],
        fechaInicio: '2025-01-05',
        estado: 'activo',
        contacto: {
          nombre: 'Marcela Ortiz',
          email: 'mortiz@uchile.cl',
          telefono: '+56 2 3123 4567'
        },
        historial: [
          { campana: 'Admisión 2025', periodo: 'Ene-Mar 2025', inversion: 4200000, resultado: '+15% postulaciones' }
        ]
      },
      {
        id: 'c10',
        nombre: 'Duoc UC',
        rubro: 'Educación',
        inversion: 3000000,
        pantallas: ['P-027 Puente Alto', 'P-028 Maipú', 'P-029 La Florida'],
        fechaInicio: '2025-02-20',
        estado: 'prospecto',
        contacto: {
          nombre: 'Gabriel Fuentes',
          email: 'gfuentes@duocuc.cl',
          telefono: '+56 2 3234 5678'
        },
        historial: [
          { campana: 'Carreras Técnicas 2025', periodo: 'Mar 2025', inversion: 3000000, resultado: 'En negociación' }
        ]
      }
    ]
  },
  {
    id: '8',
    nombre: 'Francisca Lagos',
    cargo: 'Vendedor',
    avatar: '👩‍💼',
    email: 'francisca.lagos@flesad.com',
    telefono: '+56 9 8901 2345',
    metaMensual: 15000000,
    ventasActuales: 11500000,
    especialidad: 'Bancos y Seguros',
    region: 'Santiago Norte',
    clientes: [
      {
        id: 'c11',
        nombre: 'BCI Banco',
        rubro: 'Finanzas',
        inversion: 7000000,
        pantallas: ['P-030 Las Condes', 'P-031 Vitacura', 'P-032 La Dehesa'],
        fechaInicio: '2024-12-10',
        estado: 'activo',
        contacto: {
          nombre: 'Eduardo Campos',
          email: 'ecampos@bci.cl',
          telefono: '+56 2 3345 6789'
        },
        historial: [
          { campana: 'Tarjeta BciMás', periodo: 'Dic 2024-Feb 2025', inversion: 7000000, resultado: '+52% solicitudes' }
        ]
      },
      {
        id: 'c12',
        nombre: 'Seguros Bice Vida',
        rubro: 'Seguros',
        inversion: 4500000,
        pantallas: ['P-033 Providencia', 'P-034 Santiago Centro'],
        fechaInicio: '2025-03-05',
        estado: 'activo',
        contacto: {
          nombre: 'Silvia Navarro',
          email: 'snavarro@bicevida.cl',
          telefono: '+56 2 3456 7890'
        },
        historial: [
          { campana: 'Seguro Educacional', periodo: 'Mar-May 2025', inversion: 4500000, resultado: '+25% cotizaciones' }
        ]
      }
    ]
  }
];

// Recomendaciones de IA para inventario no vendido
const RECOMENDACIONES_IA = [
  {
    id: 'r1',
    pantalla: 'P-045 Quilicura',
    tipo: 'Oportunidad Detectada',
    prioridad: 'alta',
    descripcion: 'Pantalla con 78% de disponibilidad en Q2. Alto tráfico de vehículos comerciales livianos.',
    rubroSugerido: 'Logística y Transporte',
    marcaSugerida: 'Starken / Chilexpress',
    razonamiento: 'El análisis histórico muestra que esta zona tiene 3x más vehículos de reparto que el promedio. Empresas de logística aumentaron su inversión en OOH un 45% el último trimestre.',
    inversionEstimada: 4500000,
    accion: 'Contactar gerente de marketing'
  },
  {
    id: 'r2',
    pantalla: 'P-052 La Pintana',
    tipo: 'Predicción de Demanda',
    prioridad: 'media',
    descripcion: 'Zona con crecimiento del 23% en tráfico de vehículos segmento C. Pantalla disponible desde Abril.',
    rubroSugerido: 'Retail de Descuento',
    marcaSugerida: 'Hites / Paris',
    razonamiento: 'El perfil socioeconómico de la zona coincide con el target de retail de descuento. Competencia directa (Falabella) tuvo +31% de tráfico con campaña similar en zona sur.',
    inversionEstimada: 3200000,
    accion: 'Preparar propuesta con datos de tráfico'
  },
  {
    id: 'r3',
    pantalla: 'P-018 Puente Alto',
    tipo: 'Upsell',
    prioridad: 'alta',
    descripcion: 'Cliente actual Chevrolet tiene 65% de share en la pantalla. Oportunidad de vender slots restantes.',
    rubroSugerido: 'Automotriz (Competencia)',
    marcaSugerida: 'Nissan / Mazda / Hyundai',
    razonamiento: 'La pantalla tiene alta efectividad para el segmento automotriz. Nissan no tiene presencia en esta zona y su cuota de mercado ha crecido 12% YoY.',
    inversionEstimada: 5000000,
    accion: 'Agendar reunión con Nissan'
  },
  {
    id: 'r4',
    pantalla: 'P-007 Vitacura',
    tipo: 'Oportunidad Estacional',
    prioridad: 'media',
    descripcion: 'Pantalla premium con disponibilidad en Mayo. Históricamente alto tráfico de vehículos premium en este periodo.',
    rubroSugerido: 'Bancos Premium',
    marcaSugerida: 'Banco Itaú / Scotiabank',
    razonamiento: 'Mayo es el mes peak para productos de inversión. Itaú lanzó nueva línea de wealth management y no tiene presencia en pantallas premium del sector oriente.',
    inversionEstimada: 8500000,
    accion: 'Enviar case study de Vitacura'
  },
  {
    id: 'r5',
    pantalla: 'P-033 Providencia',
    tipo: 'Match de Audiencia',
    prioridad: 'alta',
    descripcion: 'Pantalla con 82% de vehículos segmento AB. Disponible las próximas 3 semanas.',
    rubroSugerido: 'Inmobiliarias',
    marcaSugerida: 'Paic / Ilunion / Besalco',
    razonamiento: 'El perfil de audiencia coincide exactamente con compradores de proyectos inmobiliarios premium. Paic tiene 2 proyectos nuevos en la zona y no ha invertido en OOH este año.',
    inversionEstimada: 6200000,
    accion: 'Contactar con propuesta personalizada'
  },
  {
    id: 'r6',
    pantalla: 'P-041 Ñuñoa',
    tipo: 'Tendencia Detectada',
    prioridad: 'baja',
    descripcion: 'Aumento del 34% en vehículos eléctricos en la zona. Pantalla con disponibilidad parcial.',
    rubroSugerido: 'Movilidad Eléctrica',
    marcaSugerida: 'Tesla / BYD / Volvo',
    razonamiento: 'Ñuñoa es la comuna con mayor crecimiento de vehículos eléctricos en Santiago. Tesla está en proceso de expansión y necesita visibilidad en zonas de alto potencial.',
    inversionEstimada: 4000000,
    accion: 'Monitorear y contactar en Q3'
  }
];

// Formateador de moneda CLP
const formatCLP = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
};

// Componente de tarjeta de miembro del equipo
function TeamMemberCard({ member, isExpanded, onToggle }: { member: Vendedor; isExpanded: boolean; onToggle: () => void }) {
  const porcentajeMeta = member.metaMensual > 0 ? (member.ventasActuales / member.metaMensual) * 100 : 0;
  const estadoMeta = porcentajeMeta >= 100 ? 'success' : porcentajeMeta >= 70 ? 'warning' : 'danger';

  return (
    <motion.div
      layout
      className={cn(
        "bg-navy-950/50 border rounded-xl overflow-hidden transition-all",
        member.cargo === 'Director' ? "border-amber-500/30" :
        member.cargo === 'Supervisor' ? "border-purple-500/30" : "border-white/10"
      )}
    >
      {/* Header de la tarjeta */}
      <div onClick={onToggle} className="p-4 cursor-pointer hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center text-3xl",
            member.cargo === 'Director' ? "bg-amber-500/20 border border-amber-500/30" :
            member.cargo === 'Supervisor' ? "bg-purple-500/20 border border-purple-500/30" : "bg-cyan-500/20 border border-cyan-500/30"
          )}>
            {member.avatar}
          </div>

          {/* Información principal */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{member.nombre}</h3>
              {member.cargo === 'Director' && <Award className="w-4 h-4 text-amber-400" />}
              {member.cargo === 'Supervisor' && <Star className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-sm text-gray-400">{member.cargo} | {member.especialidad}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {member.region}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {member.email}
              </span>
            </div>
          </div>

          {/* Meta y progreso (solo vendedores) */}
          {member.cargo === 'Vendedor' && (
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Meta Mensual</p>
              <p className="text-lg font-bold text-white">{formatCLP(member.metaMensual)}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      estadoMeta === 'success' ? "bg-emerald-500" :
                      estadoMeta === 'warning' ? "bg-amber-500" : "bg-rose-500"
                    )}
                    style={{ width: `${Math.min(porcentajeMeta, 100)}%` }}
                  />
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  estadoMeta === 'success' ? "text-emerald-400" :
                  estadoMeta === 'warning' ? "text-amber-400" : "text-rose-400"
                )}>
                  {porcentajeMeta.toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{formatCLP(member.ventasActuales)} vendido</p>
            </div>
          )}

          {/* Icono expandir */}
          <div className="p-2">
            {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
      </div>

      {/* Contenido expandido */}
      {isExpanded && member.cargo === 'Vendedor' && (
        <div className="px-4 pb-4 border-t border-white/10">
          {/* Clientes */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Cartera de Clientes ({member.clientes.length})
            </h4>
            <div className="space-y-3">
              {member.clientes.map((cliente) => (
                <ClienteCard key={cliente.id} cliente={cliente} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mensaje para Director/Supervisor */}
      {isExpanded && member.cargo !== 'Vendedor' && (
        <div className="px-4 pb-4 border-t border-white/10">
          <div className="mt-4 p-4 bg-navy-900/50 rounded-xl border border-white/5">
            <p className="text-sm text-gray-300">
              {member.cargo === 'Director' 
                ? 'Responsable de la estrategia comercial global y relaciones con clientes corporativos clave.'
                : 'Supervisa el desempeño del equipo de ventas y coordina las operaciones diarias.'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Componente de tarjeta de cliente
function ClienteCard({ cliente }: { cliente: Cliente }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-navy-900/50 border border-white/5 rounded-xl overflow-hidden">
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h5 className="font-medium text-white">{cliente.nombre}</h5>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                cliente.estado === 'activo' ? "bg-emerald-500/20 text-emerald-400" :
                cliente.estado === 'prospecto' ? "bg-amber-500/20 text-amber-400" : "bg-gray-500/20 text-gray-400"
              )}>
                {cliente.estado}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{cliente.rubro} | {formatCLP(cliente.inversion)}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="p-1">
            {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        {/* Pantallas contratadas */}
        <div className="mt-2 flex flex-wrap gap-1">
          {cliente.pantallas.map((pantalla, idx) => (
            <span key={idx} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400">
              {pantalla}
            </span>
          ))}
        </div>

        {/* Contacto */}
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> {cliente.contacto.nombre}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" /> {cliente.contacto.email}
          </span>
        </div>
      </div>

      {/* Historial expandido */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-white/5">
          <h6 className="text-xs font-semibold text-gray-400 mt-3 mb-2">Historial de Campañas</h6>
          <div className="space-y-2">
            {cliente.historial.map((campana, idx) => (
              <div key={idx} className="p-2 bg-navy-950/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{campana.campana}</span>
                  <span className="text-xs text-gray-500">{campana.periodo}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-cyan-400">{formatCLP(campana.inversion)}</span>
                  <span className="text-xs text-emerald-400">{campana.resultado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de recomendación de IA
function IARecomendacionCard({ recomendacion }: { recomendacion: typeof RECOMENDACIONES_IA[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "bg-navy-950/50 border rounded-xl p-4 transition-all",
        recomendacion.prioridad === 'alta' ? "border-rose-500/30" :
        recomendacion.prioridad === 'media' ? "border-amber-500/30" : "border-blue-500/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          recomendacion.prioridad === 'alta' ? "bg-rose-500/20" :
          recomendacion.prioridad === 'media' ? "bg-amber-500/20" : "bg-blue-500/20"
        )}>
          <Brain className={cn(
            "w-5 h-5",
            recomendacion.prioridad === 'alta' ? "text-rose-400" :
            recomendacion.prioridad === 'media' ? "text-amber-400" : "text-blue-400"
          )} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white">{recomendacion.pantalla}</h4>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              recomendacion.prioridad === 'alta' ? "bg-rose-500/20 text-rose-400" :
              recomendacion.prioridad === 'media' ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
            )}>
              {recomendacion.tipo}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{recomendacion.descripcion}</p>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-2 bg-navy-900/50 rounded-lg">
              <p className="text-xs text-gray-500">Rubro Sugerido</p>
              <p className="text-sm text-cyan-400 font-medium">{recomendacion.rubroSugerido}</p>
            </div>
            <div className="p-2 bg-navy-900/50 rounded-lg">
              <p className="text-xs text-gray-500">Marca Objetivo</p>
              <p className="text-sm text-magenta-400 font-medium">{recomendacion.marcaSugerida}</p>
            </div>
          </div>

          <div className="mt-3 p-3 bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 border border-cyan-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <p className="text-xs font-semibold text-cyan-400">Análisis de IA</p>
            </div>
            <p className="text-sm text-gray-300">{recomendacion.razonamiento}</p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">{formatCLP(recomendacion.inversionEstimada)}</span>
            </div>
            <button className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {recomendacion.accion}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Página principal del Equipo
export function Team() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'organigrama' | 'recomendaciones'>('organigrama');

  // Calcular totales del equipo
  const vendedores = EQUIPO_DATA.filter(m => m.cargo === 'Vendedor');
  const totalMeta = vendedores.reduce((acc, v) => acc + v.metaMensual, 0);
  const totalVentas = vendedores.reduce((acc, v) => acc + v.ventasActuales, 0);
  const porcentajeEquipo = (totalVentas / totalMeta) * 100;

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 relative z-10 p-6">
      {/* Header Section */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 drop-shadow-md flex items-center gap-3">
          <Users className="w-7 h-7 text-cyan-400" />
          Equipo de Ventas
        </h1>
        <p className="text-gray-400 text-sm md:text-base">Organigrama, metas y recomendaciones de IA</p>
      </div>
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex bg-navy-950/50 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('organigrama')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'organigrama' ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"
            )}
          >
            Organigrama
          </button>
          <button
            onClick={() => setActiveTab('recomendaciones')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'recomendaciones' ? "bg-magenta-500 text-white" : "text-gray-400 hover:text-white"
            )}
          >
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Recomendaciones IA
            </span>
          </button>
        </div>
      </div>

      {/* KPIs del Equipo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400">Meta Total Equipo</p>
          <p className="text-xl font-bold text-white mt-1">{formatCLP(totalMeta)}</p>
        </div>
        <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400">Ventas Actuales</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{formatCLP(totalVentas)}</p>
        </div>
        <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400">Cumplimiento</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xl font-bold text-white">{porcentajeEquipo.toFixed(1)}%</p>
            {porcentajeEquipo >= 100 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-amber-400" />
            )}
          </div>
        </div>
        <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400">Vendedores Activos</p>
          <p className="text-xl font-bold text-white mt-1">{vendedores.length}</p>
        </div>
      </div>

      {/* Barra de progreso del equipo */}
      <div className="bg-navy-950/50 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-white">Progreso del Equipo</p>
          <p className="text-sm text-gray-400">{formatCLP(totalMeta - totalVentas)} restante</p>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-full transition-all"
            style={{ width: `${Math.min(porcentajeEquipo, 100)}%` }}
          />
        </div>
      </div>

      {/* Contenido principal */}
      {activeTab === 'organigrama' ? (
        <div className="space-y-4">
          {/* Director */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Dirección
            </h3>
            <TeamMemberCard
              member={EQUIPO_DATA.find(m => m.cargo === 'Director')!}
              isExpanded={expandedMember === '1'}
              onToggle={() => setExpandedMember(expandedMember === '1' ? null : '1')}
            />
          </div>

          {/* Supervisor */}
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Supervisión
            </h3>
            <TeamMemberCard
              member={EQUIPO_DATA.find(m => m.cargo === 'Supervisor')!}
              isExpanded={expandedMember === '2'}
              onToggle={() => setExpandedMember(expandedMember === '2' ? null : '2')}
            />
          </div>

          {/* Vendedores */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Equipo de Ventas
            </h3>
            <div className="space-y-3">
              {vendedores.map((vendedor) => (
                <TeamMemberCard
                  key={vendedor.id}
                  member={vendedor}
                  isExpanded={expandedMember === vendedor.id}
                  onToggle={() => setExpandedMember(expandedMember === vendedor.id ? null : vendedor.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header de recomendaciones */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 border border-cyan-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Recomendaciones de IA para Inventario No Vendido</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Análisis predictivo basado en histórico de tráfico, comportamiento de marcas y tendencias del mercado
                </p>
              </div>
            </div>
          </div>

          {/* Filtros de prioridad */}
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full text-xs text-rose-400">
              {RECOMENDACIONES_IA.filter(r => r.prioridad === 'alta').length} Prioridad Alta
            </span>
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs text-amber-400">
              {RECOMENDACIONES_IA.filter(r => r.prioridad === 'media').length} Prioridad Media
            </span>
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400">
              {RECOMENDACIONES_IA.filter(r => r.prioridad === 'baja').length} Prioridad Baja
            </span>
          </div>

          {/* Lista de recomendaciones */}
          <div className="space-y-4">
            {RECOMENDACIONES_IA.map((recomendacion) => (
              <IARecomendacionCard key={recomendacion.id} recomendacion={recomendacion} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}