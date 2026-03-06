// Exportación unificada de datos del sistema

export * from './rubros';
export * from './agencias';
export * from './marcas';
export * from './vendedores';
export * from './unifiedData';

// Utilidad para obtener información completa de una marca con rubro y agencia
import { MARCAS, Marca, getMarcaById } from './marcas';
import { RUBROS, Rubro } from './rubros';
import { AGENCIAS, Agencia } from './agencias';
import { VENDEDORES, Vendedor, getVendedorById } from './vendedores';

export interface MarcaCompleta extends Marca {
  rubro?: Rubro;
  agencia?: Agencia;
  vendedor?: Vendedor;
}

export const getMarcaCompleta = (id: string): MarcaCompleta | undefined => {
  const marca = getMarcaById(id);
  if (!marca) return undefined;

  const rubro = RUBROS.find(r => r.id === marca.rubroId);
  const agencia = AGENCIAS.find(a => a.id === marca.agenciaId);
  const vendedor = VENDEDORES.find(v => v.activo && v.marcasIds.includes(id));

  return {
    ...marca,
    rubro,
    agencia,
    vendedor
  };
};

export const getMarcasConDetalles = (): MarcaCompleta[] => {
  return MARCAS.filter(m => m.activo).map(m => ({
    ...m,
    rubro: RUBROS.find(r => r.id === m.rubroId),
    agencia: AGENCIAS.find(a => a.id === m.agenciaId),
    vendedor: VENDEDORES.find(v => v.activo && v.marcasIds.includes(m.id))
  }));
};

// Utilidad para obtener todos los datos de un vendedor con sus marcas
export interface VendedorCompleto extends Vendedor {
  marcas: MarcaCompleta[];
}

export const getVendedorCompleto = (id: string): VendedorCompleto | undefined => {
  const vendedor = getVendedorById(id);
  if (!vendedor) return undefined;

  const marcas = vendedor.marcasIds
    .map((marcaId: string) => getMarcaCompleta(marcaId))
    .filter((m): m is MarcaCompleta => m !== undefined);

  return {
    ...vendedor,
    marcas
  };
};

export const getVendedoresConMarcas = (): VendedorCompleto[] => {
  return VENDEDORES.filter(v => v.activo).map(v => ({
    ...v,
    marcas: v.marcasIds
      .map((marcaId: string) => getMarcaCompleta(marcaId))
      .filter((m): m is MarcaCompleta => m !== undefined)
  }));
};

// Utilidad para generar insights automáticos basados en datos reales
export interface InsightData {
  marcaId: string;
  vendedorId: string;
  rubroId: string;
  agenciaId: string;
  tipo: 'oportunidad' | 'alerta' | 'tendencia' | 'inventario' | 'competencia';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  ubicacion?: string;
  timeframe?: string;
  valorEstimado?: number;
  accion?: string;
  datos?: { label: string; valor: string }[];
}