// Agencias de medios que gestionan marcas en el sistema

export interface Agencia {
  id: string;
  nombre: string;
  color: string;
  contacto?: string;
  email?: string;
}

export const AGENCIAS: Agencia[] = [
  {
    id: 'bam',
    nombre: 'BAM (Brand & Advertising Media)',
    color: '#3b82f6',
    contacto: 'María González',
    email: 'maria@bam.cl'
  },
  {
    id: 'mindshare',
    nombre: 'Mindshare Chile',
    color: '#8b5cf6',
    contacto: 'Carlos Muñoz',
    email: 'carlos@mindshare.cl'
  },
  {
    id: 'publicis',
    nombre: 'Publicis Media',
    color: '#f59e0b',
    contacto: 'Andrea Silva',
    email: 'andrea@publicis.cl'
  },
  {
    id: 'groupm',
    nombre: 'GroupM Chile',
    color: '#10b981',
    contacto: 'Roberto Díaz',
    email: 'roberto@groupm.cl'
  },
  {
    id: 'omnicom',
    nombre: 'Omnicom Media Group',
    color: '#ef4444',
    contacto: 'Patricia Rojas',
    email: 'patricia@omnicom.cl'
  },
  {
    id: 'dentsu',
    nombre: 'Dentsu Chile',
    color: '#06b6d4',
    contacto: 'Luis Fuentes',
    email: 'luis@dentsu.cl'
  },
  {
    id: 'havas',
    nombre: 'Havas Media',
    color: '#ec4899',
    contacto: 'Carmen Torres',
    email: 'carmen@havas.cl'
  },
  {
    id: 'ipreality',
    nombre: 'iPReality',
    color: '#84cc16',
    contacto: 'Jorge Valenzuela',
    email: 'jorge@ipreality.cl'
  },
  {
    id: 'directo',
    nombre: 'Directo (Sin Agencia)',
    color: '#6b7280',
    contacto: '',
    email: ''
  }
];

export const getAgenciaById = (id: string): Agencia | undefined => {
  return AGENCIAS.find(a => a.id === id);
};

export const getAgenciaColor = (id: string): string => {
  const agencia = getAgenciaById(id);
  return agencia?.color || '#6b7280';
};

export const isDirecto = (agenciaId: string): boolean => {
  return agenciaId === 'directo';
};