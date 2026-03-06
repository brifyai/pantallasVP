/**
 * Sistema de Datos Unificado para Flesad Analytics
 * 
 * Este archivo centraliza y relaciona todos los datos del sistema:
 * - Marcas → Rubros → Agencias → Vendedores
 * - Detecciones → Pantallas → Comunas
 * - Insights generados automáticamente basados en correlaciones
 */

import { MARCAS, Marca, getMarcaById } from './marcas';
import { RUBROS, Rubro, getRubroById } from './rubros';
import { AGENCIAS, Agencia, getAgenciaById } from './agencias';
import { VENDEDORES, Vendedor, getVendedorById, getVendedorByMarca } from './vendedores';
import { COMMUNES, PREMIUM_COMMUNES } from './mockData';

// ============================================================================
// TIPOS UNIFICADOS
// ============================================================================

export interface MarcaPremium extends Marca {
  esPremium: boolean;
  rubro?: Rubro;
  agencia?: Agencia;
  vendedor?: Vendedor;
}

export interface PantallaUnificada {
  id: number;
  nombre: string;
  comuna: string;
  lat: number;
  lng: number;
  esPremium: boolean;
  tipoZona: 'premium' | 'media' | 'popular';
  traficoPromedio: number;
  premiumRatio: number;
  adScore: number;
}

export interface DeteccionUnificada {
  id: string;
  timestamp: string;
  pantallaId: number;
  marcaId: string;
  rubroId: string;
  tipoVehiculo: string;
  anio: number;
  // Datos relacionados
  marca?: MarcaPremium;
  rubro?: Rubro;
  agencia?: Agencia;
  vendedor?: Vendedor;
}

export interface InsightAutomatico {
  id: string;
  tipo: 'oportunidad' | 'alerta' | 'tendencia' | 'inventario' | 'competencia';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  marcaId?: string;
  rubroId?: string;
  comuna?: string;
  pantallaId?: number;
  vendedorId?: string;
  valorEstimado?: number;
  datos: {
    label: string;
    valor: string | number;
    cambio?: number;
  }[];
  accionRecomendada?: string;
  generadoEn: string;
}

// ============================================================================
// MARCAS PREMIUM (sincronizado con marcas.ts)
// ============================================================================

export const MARCAS_PREMIUM_IDS = [
  'bmw', 'mercedes', 'audi', 'volvo', 'lexus', 'porsche', 'tesla',
  'jeep', 'ford', 'volkswagen' // SUVs y sedanes premium
];

export const getMarcaPremium = (id: string): MarcaPremium | undefined => {
  const marca = getMarcaById(id);
  if (!marca) return undefined;

  const rubro = getRubroById(marca.rubroId);
  const agencia = getAgenciaById(marca.agenciaId);
  const vendedor = getVendedorByMarca(id);

  return {
    ...marca,
    esPremium: MARCAS_PREMIUM_IDS.includes(id),
    rubro,
    agencia,
    vendedor
  };
};

export const getMarcasPremium = (): MarcaPremium[] => {
  return MARCAS
    .filter(m => m.activo)
    .map(m => getMarcaPremium(m.id))
    .filter((m): m is MarcaPremium => m !== undefined);
};

export const esMarcaPremium = (id: string): boolean => {
  return MARCAS_PREMIUM_IDS.includes(id);
};

// ============================================================================
// PANTALLAS UNIFICADAS
// ============================================================================

export const PANTALLAS: PantallaUnificada[] = COMMUNES.map((commune, index) => {
  const esPremium = PREMIUM_COMMUNES.includes(commune);
  
  // Calcular tipo de zona basado en comuna
  let tipoZona: 'premium' | 'media' | 'popular' = 'media';
  if (['Las Condes', 'Vitacura', 'Lo Barnechea'].includes(commune)) {
    tipoZona = 'premium';
  } else if (['Providencia', 'La Reina', 'Ñuñoa', 'Santiago Centro'].includes(commune)) {
    tipoZona = 'media';
  } else {
    tipoZona = 'popular';
  }

  // Tráfico promedio basado en tipo de zona
  const traficoBase = tipoZona === 'premium' ? 3500 : tipoZona === 'media' ? 2800 : 2200;
  const traficoPromedio = Math.round(traficoBase * (0.8 + Math.random() * 0.4));
  
  // Premium ratio estimado
  const premiumRatio = tipoZona === 'premium' ? 0.35 : tipoZona === 'media' ? 0.15 : 0.08;
  
  // Calcular Ad Score
  const volumenScore = Math.min((traficoPromedio / 5000) * 100, 100);
  const adScore = Math.round((volumenScore * 0.4) + (premiumRatio * 100 * 0.6));

  return {
    id: index + 1,
    nombre: `Pantalla ${commune}`,
    comuna: commune,
    lat: -33.45 + (Math.random() - 0.5) * 0.2,
    lng: -70.65 + (Math.random() - 0.5) * 0.2,
    esPremium,
    tipoZona,
    traficoPromedio,
    premiumRatio,
    adScore
  };
});

// ============================================================================
// GENERADOR DE DETECCIONES UNIFICADAS
// ============================================================================

import { startOfHour, subDays } from 'date-fns';

const VEHICULO_TIPOS = ['Sedan', 'SUV', 'Hatchback', 'Camioneta', 'Pickup'];

const getTipoVehiculoPorMarca = (marcaId: string): string => {
  if (['bmw', 'mercedes', 'audi', 'lexus', 'porsche'].includes(marcaId)) {
    return 'Sedan';
  }
  if (['jeep', 'ford', 'volkswagen', 'haval', 'mg'].includes(marcaId)) {
    return 'SUV';
  }
  return VEHICULO_TIPOS[Math.floor(Math.random() * VEHICULO_TIPOS.length)];
};

export const generateDetectionsUnificadas = (hours: number = 24): DeteccionUnificada[] => {
  const detecciones: DeteccionUnificada[] = [];
  const now = new Date();
  let idCounter = 1;

  // Obtener marcas activas agrupadas por tipo
  const marcasActivas = MARCAS.filter(m => m.activo);
  const marcasPremium = marcasActivas.filter(m => esMarcaPremium(m.id));
  const marcasNormales = marcasActivas.filter(m => !esMarcaPremium(m.id));

  for (let i = 0; i < hours; i++) {
    const currentHourTime = startOfHour(subDays(now, 0));
    currentHourTime.setHours(now.getHours() - i);
    const hour = currentHourTime.getHours();
    
    // Modificador de volumen por hora
    let volumeModifier = 0.5;
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      volumeModifier = 1.5; // Peak hours
    } else if (hour >= 0 && hour <= 5) {
      volumeModifier = 0.1; // Madrugada
    } else if (hour >= 10 && hour <= 16) {
      volumeModifier = 0.8; // Horas normales
    }

    PANTALLAS.forEach(pantalla => {
      // Volumen base ajustado por tráfico de la pantalla
      const baseTraffic = pantalla.traficoPromedio / 100; // Escalar a detecciones por hora
      const deteccionesEstaHora = Math.floor((baseTraffic * volumeModifier) + (Math.random() * 10));

      for (let j = 0; j < deteccionesEstaHora; j++) {
        // Probabilidad de marca premium basada en zona
        const esPremium = Math.random() < pantalla.premiumRatio;
        const marcaPool = esPremium ? marcasPremium : marcasNormales;
        const marcaSeleccionada = marcaPool[Math.floor(Math.random() * marcaPool.length)];

        const marcaData = getMarcaPremium(marcaSeleccionada.id);

        detecciones.push({
          id: `det-${idCounter++}`,
          timestamp: new Date(currentHourTime.getTime() + Math.random() * 3600000).toISOString(),
          pantallaId: pantalla.id,
          marcaId: marcaSeleccionada.id,
          rubroId: marcaSeleccionada.rubroId,
          tipoVehiculo: getTipoVehiculoPorMarca(marcaSeleccionada.id),
          anio: 2010 + Math.floor(Math.random() * 14),
          marca: marcaData,
          rubro: marcaData?.rubro,
          agencia: marcaData?.agencia,
          vendedor: marcaData?.vendedor
        });
      }
    });
  }

  return detecciones;
};

export const DETECCIONES_RECIENTES = generateDetectionsUnificadas(24);

// ============================================================================
// GENERADOR DE INSIGHTS AUTOMÁTICOS
// ============================================================================

export const generarInsightsAutomaticos = (): InsightAutomatico[] => {
  const insights: InsightAutomatico[] = [];
  const now = new Date().toISOString();

  // Analizar detecciones por rubro
  const deteccionesPorRubro = DETECCIONES_RECIENTES.reduce((acc, det) => {
    if (det.rubroId) {
      acc[det.rubroId] = (acc[det.rubroId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Analizar detecciones por comuna
  const deteccionesPorComuna = DETECCIONES_RECIENTES.reduce((acc, det) => {
    const pantalla = PANTALLAS.find(p => p.id === det.pantallaId);
    if (pantalla) {
      acc[pantalla.comuna] = (acc[pantalla.comuna] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Analizar detecciones por marca
  const deteccionesPorMarca = DETECCIONES_RECIENTES.reduce((acc, det) => {
    acc[det.marcaId] = (acc[det.marcaId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 1. Insight: Rubro con mayor crecimiento
  const rubroTop = Object.entries(deteccionesPorRubro)
    .sort((a, b) => b[1] - a[1])[0];
  if (rubroTop) {
    const rubro = getRubroById(rubroTop[0]);
    const vendedor = VENDEDORES.find(v => v.marcasIds.some(m => 
      MARCAS.find(marca => marca.id === m && marca.rubroId === rubroTop[0])
    ));
    
    insights.push({
      id: `insight-rubro-${now}`,
      tipo: 'tendencia',
      prioridad: 'alta',
      titulo: `${rubro?.nombre} lidera el tráfico vehicular`,
      descripcion: `El rubro ${rubro?.nombre} concentra el mayor volumen de detecciones con ${rubroTop[1]} vehículos en las últimas 24 horas.`,
      rubroId: rubroTop[0],
      vendedorId: vendedor?.id,
      valorEstimado: rubroTop[1] * 1200,
      datos: [
        { label: 'Detecciones', valor: rubroTop[1] },
        { label: 'Share estimado', valor: `${Math.round((rubroTop[1] / DETECCIONES_RECIENTES.length) * 100)}%` },
        { label: 'Valor potencial', valor: `$${(rubroTop[1] * 1200).toLocaleString('es-CL')}` }
      ],
      accionRecomendada: `Contactar a ${vendedor?.nombre} para campañas del rubro ${rubro?.nombre}`,
      generadoEn: now
    });
  }

  // 2. Insight: Comuna con mayor tráfico premium
  const comunasPremium = PANTALLAS.filter(p => p.tipoZona === 'premium');
  const comunaTop = comunasPremium
    .map(p => ({
      comuna: p.comuna,
      trafico: deteccionesPorComuna[p.comuna] || 0,
      adScore: p.adScore
    }))
    .sort((a, b) => b.trafico - a.trafico)[0];

  if (comunaTop) {
    insights.push({
      id: `insight-comuna-${now}`,
      tipo: 'oportunidad',
      prioridad: 'alta',
      titulo: `Oportunidad Premium en ${comunaTop.comuna}`,
      descripcion: `${comunaTop.comuna} registra ${comunaTop.trafico} vehículos con alto Ad Score (${comunaTop.adScore}). Ideal para marcas de lujo.`,
      comuna: comunaTop.comuna,
      pantallaId: PANTALLAS.find(p => p.comuna === comunaTop.comuna)?.id,
      valorEstimado: comunaTop.trafico * 2500,
      datos: [
        { label: 'Vehículos', valor: comunaTop.trafico },
        { label: 'Ad Score', valor: comunaTop.adScore },
        { label: 'CPM estimado', valor: '$2.500' }
      ],
      accionRecomendada: 'Ofrecer pantallas a BMW, Mercedes, Audi, bancos premium',
      generadoEn: now
    });
  }

  // 3. Insight: Marca con mayor crecimiento
  const marcaTop = Object.entries(deteccionesPorMarca)
    .sort((a, b) => b[1] - a[1])[0];
  if (marcaTop) {
    const marca = getMarcaPremium(marcaTop[0]);
    const vendedor = getVendedorByMarca(marcaTop[0]);
    
    insights.push({
      id: `insight-marca-${now}`,
      tipo: 'competencia',
      prioridad: 'media',
      titulo: `${marca?.nombre} domina el tráfico`,
      descripcion: `${marca?.nombre} es la marca más detectada con ${marcaTop[1]} vehículos. Competencia directa para marcas del mismo segmento.`,
      marcaId: marcaTop[0],
      rubroId: marca?.rubroId,
      vendedorId: vendedor?.id,
      valorEstimado: marcaTop[1] * 800,
      datos: [
        { label: 'Detecciones', valor: marcaTop[1] },
        { label: 'Share', valor: `${Math.round((marcaTop[1] / DETECCIONES_RECIENTES.length) * 100)}%` },
        { label: 'Rubro', valor: marca?.rubro ? RUBROS.find(r => r.id === marca.rubroId)?.nombre || '' : '' }
      ],
      accionRecomendada: `Contactar competidores de ${marca?.nombre} para campañas comparativas`,
      generadoEn: now
    });
  }

  // 4. Insight: Oportunidad por vendedor con bajo rendimiento
  const vendedoresConBajoRendimiento = VENDEDORES
    .filter(v => v.activo && v.ventasActuales < v.metaMensual * 0.6)
    .map(v => ({
      vendedor: v,
      cumplimiento: v.ventasActuales / v.metaMensual
    }))
    .sort((a, b) => a.cumplimiento - b.cumplimiento);

  if (vendedoresConBajoRendimiento.length > 0) {
    const vendedor = vendedoresConBajoRendimiento[0].vendedor;
    const marcasVendedor = vendedor.marcasIds.slice(0, 3).map(id => getMarcaPremium(id)).filter(Boolean);
    
    insights.push({
      id: `insight-vendedor-${now}`,
      tipo: 'inventario',
      prioridad: 'alta',
      titulo: `Oportunidad: ${vendedor.nombre} necesita apoyo`,
      descripcion: `${vendedor.nombre} tiene ${Math.round(vendedoresConBajoRendimiento[0].cumplimiento * 100)}% de cumplimiento. Enfocar en ${marcasVendedor.map(m => m?.nombre).join(', ')}.`,
      vendedorId: vendedor.id,
      valorEstimado: vendedor.metaMensual - vendedor.ventasActuales,
      datos: [
        { label: 'Meta', valor: `$${(vendedor.metaMensual / 1000000).toFixed(1)}M` },
        { label: 'Actual', valor: `$${(vendedor.ventasActuales / 1000000).toFixed(1)}M` },
        { label: 'Falta', valor: `$${((vendedor.metaMensual - vendedor.ventasActuales) / 1000000).toFixed(1)}M` }
      ],
      accionRecomendada: `Priorizar prospectos de ${vendedor.especialidad}`,
      generadoEn: now
    });
  }

  // 5. Insight: Tendencia de vehículos eléctricos/híbridos
  const marcasEco = ['tesla', 'byd', 'volvo', 'mg', 'haval'];
  const deteccionesEco = DETECCIONES_RECIENTES.filter(d => marcasEco.includes(d.marcaId)).length;
  
  if (deteccionesEco > 0) {
    insights.push({
      id: `insight-eco-${now}`,
      tipo: 'tendencia',
      prioridad: 'media',
      titulo: 'Crecimiento de Movilidad Eléctrica',
      descripcion: `Marcas eléctricas/híbridas representan ${Math.round((deteccionesEco / DETECCIONES_RECIENTES.length) * 100)}% del tráfico. Tendencia en aumento.`,
      valorEstimado: deteccionesEco * 1500,
      datos: [
        { label: 'Vehículos eco', valor: deteccionesEco },
        { label: 'Share', valor: `${Math.round((deteccionesEco / DETECCIONES_RECIENTES.length) * 100)}%` },
        { label: 'Marcas', valor: marcasEco.map(m => getMarcaPremium(m)?.nombre).filter(Boolean).join(', ') }
      ],
      accionRecomendada: 'Ofrecer pantallas en zonas premium a Tesla, BYD, Volvo',
      generadoEn: now
    });
  }

  // 6. Insight: Alerta de inventario disponible
  const pantallasBajoRendimiento = PANTALLAS
    .filter(p => p.adScore < 40)
    .slice(0, 3);

  if (pantallasBajoRendimiento.length > 0) {
    insights.push({
      id: `insight-inventario-${now}`,
      tipo: 'inventario',
      prioridad: 'baja',
      titulo: 'Inventario Disponible - Oportunidad de Upsell',
      descripcion: `${pantallasBajoRendimiento.length} pantallas con Ad Score bajo (${pantallasBajoRendimiento.map(p => p.adScore).join(', ')}) necesitan campañas de activación.`,
      valorEstimado: pantallasBajoRendimiento.length * 500000,
      datos: pantallasBajoRendimiento.map(p => ({
        label: p.nombre,
        valor: `Score: ${p.adScore}`
      })),
      accionRecomendada: 'Ofrecer paquetes promocionales a rubros de consumo masivo',
      generadoEn: now
    });
  }

  return insights.sort((a, b) => {
    const prioridadOrder = { alta: 0, media: 1, baja: 2 };
    return prioridadOrder[a.prioridad] - prioridadOrder[b.prioridad];
  });
};

export const INSIGHTS_AUTOMATICOS = generarInsightsAutomaticos();

// ============================================================================
// UTILIDADES DE ANÁLISIS
// ============================================================================

export const getAnalisisPorRubro = (rubroId: string) => {
  const detecciones = DETECCIONES_RECIENTES.filter(d => d.rubroId === rubroId);
  const marcas = MARCAS.filter(m => m.rubroId === rubroId && m.activo);
  const vendedor = VENDEDORES.find(v => v.marcasIds.some(m => 
    MARCAS.find(marca => marca.id === m && marca.rubroId === rubroId)
  ));

  const deteccionesPorMarca = detecciones.reduce((acc, d) => {
    acc[d.marcaId] = (acc[d.marcaId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDetecciones = detecciones.length;
  const sharePorMarca = Object.entries(deteccionesPorMarca).map(([marcaId, count]) => ({
    marcaId,
    marca: getMarcaPremium(marcaId),
    count,
    share: Math.round((count / totalDetecciones) * 100)
  })).sort((a, b) => b.count - a.count);

  return {
    rubro: getRubroById(rubroId),
    vendedor,
    marcas,
    totalDetecciones,
    sharePorMarca,
    detecciones
  };
};

export const getAnalisisPorVendedor = (vendedorId: string) => {
  const vendedor = getVendedorById(vendedorId);
  if (!vendedor) return null;

  const marcas = vendedor.marcasIds.map(id => getMarcaPremium(id)).filter(Boolean);
  const detecciones = DETECCIONES_RECIENTES.filter(d => vendedor.marcasIds.includes(d.marcaId));
  
  const deteccionesPorMarca = vendedor.marcasIds.reduce((acc, marcaId) => {
    acc[marcaId] = DETECCIONES_RECIENTES.filter(d => d.marcaId === marcaId).length;
    return acc;
  }, {} as Record<string, number>);

  const cumplimiento = (vendedor.ventasActuales / vendedor.metaMensual) * 100;

  return {
    vendedor,
    marcas,
    totalDetecciones: detecciones.length,
    deteccionesPorMarca,
    cumplimiento,
    faltaParaMeta: vendedor.metaMensual - vendedor.ventasActuales
  };
};

export const getAnalisisPorComuna = (comuna: string) => {
  const pantalla = PANTALLAS.find(p => p.comuna === comuna);
  if (!pantalla) return null;

  const detecciones = DETECCIONES_RECIENTES.filter(d => d.pantallaId === pantalla.id);
  
  const deteccionesPorRubro = detecciones.reduce((acc, d) => {
    if (d.rubroId) {
      acc[d.rubroId] = (acc[d.rubroId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const deteccionesPorMarca = detecciones.reduce((acc, d) => {
    acc[d.marcaId] = (acc[d.marcaId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMarcas = Object.entries(deteccionesPorMarca)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([marcaId, count]) => ({
      marca: getMarcaPremium(marcaId),
      count
    }));

  return {
    pantalla,
    totalDetecciones: detecciones.length,
    deteccionesPorRubro,
    topMarcas
  };
};

// Exportar todo para uso global
export const UnifiedData = {
  marcas: MARCAS,
  rubros: RUBROS,
  agencias: AGENCIAS,
  vendedores: VENDEDORES,
  pantallas: PANTALLAS,
  detecciones: DETECCIONES_RECIENTES,
  insights: INSIGHTS_AUTOMATICOS,
  marcasPremium: MARCAS_PREMIUM_IDS,
  getMarcaPremium,
  getMarcasPremium,
  esMarcaPremium,
  generarInsightsAutomaticos,
  getAnalisisPorRubro,
  getAnalisisPorVendedor,
  getAnalisisPorComuna
};