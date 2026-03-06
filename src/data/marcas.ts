// Marcas registradas en el sistema con sus rubros y agencias

export interface Marca {
  id: string;
  nombre: string;
  rubroId: string;
  agenciaId: string;
  logoUrl?: string;
  color?: string;
  sitioWeb?: string;
  activo: boolean;
}

export const MARCAS: Marca[] = [
  // Automotriz
  { id: 'chevrolet', nombre: 'Chevrolet', rubroId: 'automotriz', agenciaId: 'directo', color: '#c8102e', activo: true },
  { id: 'nissan', nombre: 'Nissan', rubroId: 'automotriz', agenciaId: 'bam', color: '#c3002f', activo: true },
  { id: 'mazda', nombre: 'Mazda', rubroId: 'automotriz', agenciaId: 'mindshare', color: '#101010', activo: true },
  { id: 'hyundai', nombre: 'Hyundai', rubroId: 'automotriz', agenciaId: 'groupm', color: '#002c5f', activo: true },
  { id: 'kia', nombre: 'Kia', rubroId: 'automotriz', agenciaId: 'publicis', color: '#05141f', activo: true },
  { id: 'toyota', nombre: 'Toyota', rubroId: 'automotriz', agenciaId: 'omnicom', color: '#eb0a1e', activo: true },
  { id: 'volkswagen', nombre: 'Volkswagen', rubroId: 'automotriz', agenciaId: 'dentsu', color: '#001e50', activo: true },
  { id: 'bmw', nombre: 'BMW', rubroId: 'automotriz', agenciaId: 'havas', color: '#0066b1', activo: true },
  { id: 'mercedes', nombre: 'Mercedes-Benz', rubroId: 'automotriz', agenciaId: 'ipreality', color: '#000000', activo: true },
  { id: 'audi', nombre: 'Audi', rubroId: 'automotriz', agenciaId: 'bam', color: '#bb0a30', activo: true },
  { id: 'suzuki', nombre: 'Suzuki', rubroId: 'automotriz', agenciaId: 'directo', color: '#e60012', activo: true },
  { id: 'mg', nombre: 'MG', rubroId: 'automotriz', agenciaId: 'mindshare', color: '#ff6600', activo: true },
  { id: 'haval', nombre: 'Haval', rubroId: 'automotriz', agenciaId: 'groupm', color: '#2d2d2d', activo: true },
  { id: 'jeep', nombre: 'Jeep', rubroId: 'automotriz', agenciaId: 'publicis', color: '#000000', activo: true },
  { id: 'ford', nombre: 'Ford', rubroId: 'automotriz', agenciaId: 'omnicom', color: '#1c396d', activo: true },
  
  // Retail
  { id: 'falabella', nombre: 'Falabella', rubroId: 'retail', agenciaId: 'bam', color: '#002868', activo: true },
  { id: 'paris', nombre: 'Paris', rubroId: 'retail', agenciaId: 'mindshare', color: '#662d91', activo: true },
  { id: 'ripley', nombre: 'Ripley', rubroId: 'retail', agenciaId: 'groupm', color: '#00a9e0', activo: true },
  { id: 'hites', nombre: 'Hites', rubroId: 'retail', agenciaId: 'publicis', color: '#ed1c24', activo: true },
  { id: 'lider', nombre: 'Líder', rubroId: 'retail', agenciaId: 'dentsu', color: '#005eb8', activo: true },
  { id: 'jumbo', nombre: 'Jumbo', rubroId: 'retail', agenciaId: 'havas', color: '#e30613', activo: true },
  { id: 'tottus', nombre: 'Tottus', rubroId: 'retail', agenciaId: 'ipreality', color: '#e30613', activo: true },
  { id: 'easy', nombre: 'Easy', rubroId: 'retail', agenciaId: 'bam', color: '#f39200', activo: true },
  { id: 'sodimac', nombre: 'Sodimac', rubroId: 'retail', agenciaId: 'mindshare', color: '#005eb8', activo: true },
  { id: 'unimarc', nombre: 'Unimarc', rubroId: 'retail', agenciaId: 'groupm', color: '#0055a5', activo: true },
  
  // Bancos
  { id: 'santander', nombre: 'Banco Santander', rubroId: 'bancos', agenciaId: 'bam', color: '#ec0000', activo: true },
  { id: 'chile', nombre: 'Banco de Chile', rubroId: 'bancos', agenciaId: 'mindshare', color: '#003366', activo: true },
  { id: 'bci', nombre: 'BCI', rubroId: 'bancos', agenciaId: 'groupm', color: '#00a651', activo: true },
  { id: 'itau', nombre: 'Itaú', rubroId: 'bancos', agenciaId: 'publicis', color: '#f7941d', activo: true },
  { id: 'scotiabank', nombre: 'Scotiabank', rubroId: 'bancos', agenciaId: 'dentsu', color: '#dc143c', activo: true },
  { id: 'bbva', nombre: 'BBVA', rubroId: 'bancos', agenciaId: 'havas', color: '#004481', activo: true },
  { id: 'estado', nombre: 'Banco Estado', rubroId: 'bancos', agenciaId: 'ipreality', color: '#00a950', activo: true },
  { id: 'falabella_financiero', nombre: 'Banco Falabella', rubroId: 'bancos', agenciaId: 'bam', color: '#002868', activo: true },
  
  // Telecomunicaciones
  { id: 'movistar', nombre: 'Movistar', rubroId: 'telecomunicaciones', agenciaId: 'bam', color: '#019833', activo: true },
  { id: 'entel', nombre: 'Entel', rubroId: 'telecomunicaciones', agenciaId: 'mindshare', color: '#ed1c24', activo: true },
  { id: 'claro', nombre: 'Claro', rubroId: 'telecomunicaciones', agenciaId: 'groupm', color: '#ff6600', activo: true },
  { id: 'wom', nombre: 'WOM', rubroId: 'telecomunicaciones', agenciaId: 'publicis', color: '#7535d8', activo: true },
  { id: 'vtr', nombre: 'VTR', rubroId: 'telecomunicaciones', agenciaId: 'dentsu', color: '#e60000', activo: true },
  { id: 'gtd', nombre: 'GTD', rubroId: 'telecomunicaciones', agenciaId: 'havas', color: '#00a950', activo: true },
  
  // Seguros
  { id: 'mapfre', nombre: 'Mapfre', rubroId: 'seguros', agenciaId: 'bam', color: '#004b87', activo: true },
  { id: 'seguros_bci', nombre: 'Seguros BCI', rubroId: 'seguros', agenciaId: 'mindshare', color: '#00a651', activo: true },
  { id: 'zurich', nombre: 'Zurich', rubroId: 'seguros', agenciaId: 'groupm', color: '#005eb8', activo: true },
  { id: 'chilena_consolidada', nombre: 'La Chilena Consolidada', rubroId: 'seguros', agenciaId: 'publicis', color: '#005eb8', activo: true },
  { id: 'metlife', nombre: 'MetLife', rubroId: 'seguros', agenciaId: 'dentsu', color: '#003366', activo: true },
  { id: 'pruvida', nombre: 'Pruvida', rubroId: 'seguros', agenciaId: 'havas', color: '#00a950', activo: true },
  
  // Educación
  { id: 'duoc', nombre: 'Duoc UC', rubroId: 'educacion', agenciaId: 'bam', color: '#003366', activo: true },
  { id: 'inacap', nombre: 'INACAP', rubroId: 'educacion', agenciaId: 'mindshare', color: '#ed1c24', activo: true },
  { id: 'santo_tomas', nombre: 'Santo Tomás', rubroId: 'educacion', agenciaId: 'groupm', color: '#00a950', activo: true },
  { id: 'uc', nombre: 'Pontificia Universidad Católica', rubroId: 'educacion', agenciaId: 'publicis', color: '#ed1c24', activo: true },
  { id: 'uchile', nombre: 'Universidad de Chile', rubroId: 'educacion', agenciaId: 'dentsu', color: '#003366', activo: true },
  { id: 'usach', nombre: 'USACH', rubroId: 'educacion', agenciaId: 'havas', color: '#ed1c24', activo: true },
  
  // Salud
  { id: 'colmena', nombre: 'Colmena', rubroId: 'salud', agenciaId: 'bam', color: '#00a950', activo: true },
  { id: 'cruzblanca', nombre: 'CruzBlanca', rubroId: 'salud', agenciaId: 'mindshare', color: '#005eb8', activo: true },
  { id: 'vidatres', nombre: 'Vida Tres', rubroId: 'salud', agenciaId: 'groupm', color: '#ed1c24', activo: true },
  { id: 'banmedica', nombre: 'Banmédica', rubroId: 'salud', agenciaId: 'publicis', color: '#003366', activo: true },
  { id: 'consalud', nombre: 'Consalud', rubroId: 'salud', agenciaId: 'dentsu', color: '#00a950', activo: true },
  
  // Alimentos y Bebidas
  { id: 'cocacola', nombre: 'Coca-Cola', rubroId: 'alimentos', agenciaId: 'bam', color: '#f40009', activo: true },
  { id: 'pepsi', nombre: 'Pepsi', rubroId: 'alimentos', agenciaId: 'mindshare', color: '#004b93', activo: true },
  { id: 'nestle', nombre: 'Nestlé', rubroId: 'alimentos', agenciaId: 'groupm', color: '#005eb8', activo: true },
  { id: 'unilever', nombre: 'Unilever', rubroId: 'alimentos', agenciaId: 'publicis', color: '#1c3664', activo: true },
  { id: 'ccu', nombre: 'CCU', rubroId: 'alimentos', agenciaId: 'dentsu', color: '#003366', activo: true },
  { id: 'abastible', nombre: 'Abastible', rubroId: 'alimentos', agenciaId: 'havas', color: '#ed1c24', activo: true },
  { id: 'copec', nombre: 'Copec', rubroId: 'alimentos', agenciaId: 'ipreality', color: '#ed1c24', activo: true },
  
  // Tecnología
  { id: 'samsung', nombre: 'Samsung', rubroId: 'tecnologia', agenciaId: 'bam', color: '#1428a0', activo: true },
  { id: 'apple', nombre: 'Apple', rubroId: 'tecnologia', agenciaId: 'mindshare', color: '#000000', activo: true },
  { id: 'xiaomi', nombre: 'Xiaomi', rubroId: 'tecnologia', agenciaId: 'groupm', color: '#ff6900', activo: true },
  { id: 'huawei', nombre: 'Huawei', rubroId: 'tecnologia', agenciaId: 'publicis', color: '#cf0a2c', activo: true },
  { id: 'motorola', nombre: 'Motorola', rubroId: 'tecnologia', agenciaId: 'dentsu', color: '#000000', activo: true },
  { id: 'lg', nombre: 'LG', rubroId: 'tecnologia', agenciaId: 'havas', color: '#a50034', activo: true },
  
  // Inmobiliario
  { id: 'paic', nombre: 'Paic', rubroId: 'inmobiliario', agenciaId: 'bam', color: '#003366', activo: true },
  { id: 'ilunion', nombre: 'Ilunión', rubroId: 'inmobiliario', agenciaId: 'mindshare', color: '#ed1c24', activo: true },
  { id: 'besalco', nombre: 'Besalco', rubroId: 'inmobiliario', agenciaId: 'groupm', color: '#005eb8', activo: true },
  { id: 'nuevo_maipu', nombre: 'Nuevo Maipú', rubroId: 'inmobiliario', agenciaId: 'publicis', color: '#00a950', activo: true },
  { id: 'renacer', nombre: 'Renacer', rubroId: 'inmobiliario', agenciaId: 'dentsu', color: '#f39200', activo: true },
  
  // Logística
  { id: 'starken', nombre: 'Starken', rubroId: 'logistica', agenciaId: 'bam', color: '#f39200', activo: true },
  { id: 'chilexpress', nombre: 'Chilexpress', rubroId: 'logistica', agenciaId: 'mindshare', color: '#ed1c24', activo: true },
  { id: 'correos', nombre: 'Correos de Chile', rubroId: 'logistica', agenciaId: 'groupm', color: '#005eb8', activo: true },
  { id: 'blueexpress', nombre: 'BlueExpress', rubroId: 'logistica', agenciaId: 'publicis', color: '#003366', activo: true },
  
  // Entretenimiento
  { id: 'netflix', nombre: 'Netflix', rubroId: 'entretenimiento', agenciaId: 'bam', color: '#e50914', activo: true },
  { id: 'disney', nombre: 'Disney+', rubroId: 'entretenimiento', agenciaId: 'mindshare', color: '#113ccf', activo: true },
  { id: 'hbo', nombre: 'HBO Max', rubroId: 'entretenimiento', agenciaId: 'groupm', color: '#5b00c9', activo: true },
  { id: 'amazon_prime', nombre: 'Amazon Prime', rubroId: 'entretenimiento', agenciaId: 'publicis', color: '#00a8e1', activo: true },
  { id: 'paramount', nombre: 'Paramount+', rubroId: 'entretenimiento', agenciaId: 'dentsu', color: '#0064ff', activo: true },
  { id: 'cinemark', nombre: 'Cinemark', rubroId: 'entretenimiento', agenciaId: 'havas', color: '#003366', activo: true }
];

// Utilidades
export const getMarcaById = (id: string): Marca | undefined => {
  return MARCAS.find(m => m.id === id);
};

export const getMarcasByRubro = (rubroId: string): Marca[] => {
  return MARCAS.filter(m => m.rubroId === rubroId && m.activo);
};

export const getMarcasByAgencia = (agenciaId: string): Marca[] => {
  return MARCAS.filter(m => m.agenciaId === agenciaId && m.activo);
};

export const getMarcasActivas = (): Marca[] => {
  return MARCAS.filter(m => m.activo);
};

export const searchMarcas = (query: string): Marca[] => {
  const lowerQuery = query.toLowerCase();
  return MARCAS.filter(m => 
    m.activo && (
      m.nombre.toLowerCase().includes(lowerQuery) ||
      m.id.toLowerCase().includes(lowerQuery)
    )
  );
};