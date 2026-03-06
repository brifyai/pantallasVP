// Rubros de marcas disponibles en el sistema

export interface Rubro {
  id: string;
  nombre: string;
  color: string;
  icon: string;
}

export const RUBROS: Rubro[] = [
  {
    id: 'automotriz',
    nombre: 'Automotriz',
    color: '#ef4444',
    icon: 'car'
  },
  {
    id: 'retail',
    nombre: 'Retail',
    color: '#f59e0b',
    icon: 'shopping'
  },
  {
    id: 'bancos',
    nombre: 'Bancos y Finanzas',
    color: '#10b981',
    icon: 'bank'
  },
  {
    id: 'telecomunicaciones',
    nombre: 'Telecomunicaciones',
    color: '#3b82f6',
    icon: 'phone'
  },
  {
    id: 'seguros',
    nombre: 'Seguros',
    color: '#8b5cf6',
    icon: 'shield'
  },
  {
    id: 'educacion',
    nombre: 'Educación',
    color: '#ec4899',
    icon: 'book'
  },
  {
    id: 'salud',
    nombre: 'Salud',
    color: '#14b8a6',
    icon: 'heart'
  },
  {
    id: 'alimentos',
    nombre: 'Alimentos y Bebidas',
    color: '#f97316',
    icon: 'utensils'
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología',
    color: '#6366f1',
    icon: 'cpu'
  },
  {
    id: 'inmobiliario',
    nombre: 'Inmobiliario',
    color: '#06b6d4',
    icon: 'building'
  },
  {
    id: 'logistica',
    nombre: 'Logística y Transporte',
    color: '#84cc16',
    icon: 'truck'
  },
  {
    id: 'entretenimiento',
    nombre: 'Entretenimiento',
    color: '#d946ef',
    icon: 'film'
  }
];

export const getRubroById = (id: string): Rubro | undefined => {
  return RUBROS.find(r => r.id === id);
};

export const getRubroColor = (id: string): string => {
  const rubro = getRubroById(id);
  return rubro?.color || '#6b7280';
};