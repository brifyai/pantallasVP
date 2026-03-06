// src/data/vendedores.ts
// Datos de vendedores sincronizados con Team.tsx

export interface Vendedor {
  id: string;
  nombre: string;
  cargo: 'Director' | 'Supervisor' | 'Vendedor';
  email: string;
  telefono: string;
  metaMensual: number;
  ventasActuales: number;
  especialidad: string;
  region: string;
  marcasIds: string[];
  activo: boolean;
}

// Los 6 vendedores de Team.tsx con TODAS las marcas repartidas
// Cada vendedor tiene marcas según su especialidad + marcas adicionales para cubrir todo el portafolio
export const VENDEDORES: Vendedor[] = [
  {
    id: 'v1',
    nombre: 'Andrés Silva',
    cargo: 'Vendedor',
    email: 'andres.silva@flesad.com',
    telefono: '+56 9 3456 7890',
    metaMensual: 15000000,
    ventasActuales: 12500000,
    especialidad: 'Retail y Consumo Masivo',
    region: 'Santiago Norte',
    marcasIds: [
      // Retail
      'tottus', 'lider', 'jumbo', 'falabella', 'paris', 'ripley', 'hites', 'easy', 'sodimac', 'unimarc',
      // Alimentos y Bebidas
      'cocacola', 'pepsi', 'nestle', 'unilever', 'ccu', 'abastible', 'copec',
      // Logística
      'starken', 'chilexpress', 'correos', 'blueexpress'
    ],
    activo: true
  },
  {
    id: 'v2',
    nombre: 'Patricia Torres',
    cargo: 'Vendedor',
    email: 'patricia.torres@flesad.com',
    telefono: '+56 9 4567 8901',
    metaMensual: 15000000,
    ventasActuales: 18200000,
    especialidad: 'Automotriz',
    region: 'Santiago Sur',
    marcasIds: [
      // Automotriz
      'chevrolet', 'nissan', 'mazda', 'hyundai', 'kia', 'toyota', 'volkswagen', 'bmw', 'mercedes', 'audi', 'suzuki', 'mg', 'haval', 'jeep', 'ford',
      // Inmobiliario
      'paic', 'ilunion', 'besalco', 'nuevo_maipu', 'renacer'
    ],
    activo: true
  },
  {
    id: 'v3',
    nombre: 'Miguel Ángel Castro',
    cargo: 'Vendedor',
    email: 'miguel.castro@flesad.com',
    telefono: '+56 9 5678 9012',
    metaMensual: 15000000,
    ventasActuales: 9800000,
    especialidad: 'Tecnología y Telecomunicaciones',
    region: 'Santiago Oriente',
    marcasIds: [
      // Telecomunicaciones
      'movistar', 'entel', 'claro', 'wom', 'vtr', 'gtd',
      // Tecnología
      'samsung', 'apple', 'xiaomi', 'huawei', 'motorola', 'lg',
      // Entretenimiento
      'netflix', 'disney', 'hbo', 'amazon_prime', 'paramount', 'cinemark'
    ],
    activo: true
  },
  {
    id: 'v4',
    nombre: 'Daniela Rojas',
    cargo: 'Vendedor',
    email: 'daniela.rojas@flesad.com',
    telefono: '+56 9 6789 0123',
    metaMensual: 15000000,
    ventasActuales: 14100000,
    especialidad: 'Salud y Farmacias',
    region: 'Santiago Poniente',
    marcasIds: [
      // Salud
      'colmena', 'cruzblanca', 'vidatres', 'banmedica', 'consalud',
      // Seguros
      'mapfre', 'seguros_bci', 'zurich', 'chilena_consolidada', 'metlife', 'pruvida'
    ],
    activo: true
  },
  {
    id: 'v5',
    nombre: 'Rodrigo Méndez',
    cargo: 'Vendedor',
    email: 'rodrigo.mendez@flesad.com',
    telefono: '+56 9 7890 1234',
    metaMensual: 15000000,
    ventasActuales: 7200000,
    especialidad: 'Educación y Universidades',
    region: 'Santiago Centro',
    marcasIds: [
      // Educación
      'duoc', 'inacap', 'santo_tomas', 'uc', 'uchile', 'usach'
    ],
    activo: true
  },
  {
    id: 'v6',
    nombre: 'Francisca Lagos',
    cargo: 'Vendedor',
    email: 'francisca.lagos@flesad.com',
    telefono: '+56 9 8901 2345',
    metaMensual: 15000000,
    ventasActuales: 11500000,
    especialidad: 'Bancos y Seguros',
    region: 'Santiago Norte',
    marcasIds: [
      // Bancos
      'santander', 'chile', 'bci', 'itau', 'scotiabank', 'bbva', 'estado', 'falabella_financiero'
    ],
    activo: true
  }
];

// Funciones utilitarias
export function getVendedorById(id: string): Vendedor | undefined {
  return VENDEDORES.find(v => v.id === id);
}

export function getVendedorByMarca(marcaId: string): Vendedor | undefined {
  return VENDEDORES.find(v => v.marcasIds.includes(marcaId));
}

export function getMarcasDeVendedor(vendedorId: string): string[] {
  const vendedor = getVendedorById(vendedorId);
  return vendedor ? vendedor.marcasIds : [];
}

export function searchVendedores(query: string): Vendedor[] {
  const lowerQuery = query.toLowerCase();
  return VENDEDORES.filter(v => 
    v.nombre.toLowerCase().includes(lowerQuery) ||
    v.email.toLowerCase().includes(lowerQuery) ||
    v.especialidad.toLowerCase().includes(lowerQuery)
  );
}

export function getVendedoresPorRegion(region: string): Vendedor[] {
  return VENDEDORES.filter(v => v.region === region && v.activo);
}