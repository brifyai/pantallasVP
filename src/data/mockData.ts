import { startOfHour, subDays } from 'date-fns';

export const COMMUNES = [
  'Las Condes', 'Vitacura', 'Providencia', 'Ñuñoa', 'Santiago Centro', 'Maipú',
  'La Florida', 'Puente Alto', 'San Bernardo', 'Quilicura', 'Huechuraba',
  'Independencia', 'Recoleta', 'Peñalolén', 'La Reina', 'Lo Barnechea',
  'Renca', 'Cerro Navia', 'Pudahuel', 'Estación Central', 'San Miguel',
  'La Cisterna', 'El Bosque', 'Pedro Aguirre Cerda', 'Macul',
  'San Joaquín', 'Conchalí', 'Quinta Normal', 'Cerrillos', 'Lo Espejo'
];

export const PREMIUM_COMMUNES = ['Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia', 'La Reina'];

export const BRANDS = [
  'Toyota', 'Hyundai', 'Kia', 'Chevrolet', 'Suzuki', 'Nissan', 'Mazda', 'Mitsubishi',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Peugeot', 'Citroën', 'Fiat', 'Renault',
  'Jeep', 'Ford', 'Volkswagen', 'MG', 'Changan', 'JAC', 'BYD', 'Great Wall', 'Haval',
  'Subaru', 'Honda', 'Lexus', 'Porsche', 'Tesla'
];

export const PREMIUM_BRANDS = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Tesla', 'Volvo', 'Lexus'];

export const SCREENS = COMMUNES.map((commune, index) => ({
  id: index + 1,
  name: `Pantalla ${commune}`,
  commune: commune,
  lat: -33.45 + (Math.random() - 0.5) * 0.2,
  lng: -70.65 + (Math.random() - 0.5) * 0.2,
  isPremiumArea: PREMIUM_COMMUNES.includes(commune),
}));

export interface Detection {
  id: string;
  timestamp: string;
  screenId: number;
  screenCommune: string;
  vehicle: {
    brand: string;
    type: string;
    year: number;
  };
}

export const generateDetections = (hours: number = 24): Detection[] => {
  const detections: Detection[] = [];
  const now = new Date();
  let idCounter = 1;

  for (let i = 0; i < hours; i++) {
    const currentHourTime = startOfHour(subDays(now, 0));
    currentHourTime.setHours(now.getHours() - i);
    const hour = currentHourTime.getHours();
    
    let volumeModifier = 0.5;
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      volumeModifier = 1.5;
    } else if (hour >= 0 && hour <= 5) {
      volumeModifier = 0.1;
    } else if (hour >= 10 && hour <= 16) {
      volumeModifier = 0.8;
    }

    SCREENS.forEach(screen => {
      const baseTraffic = screen.isPremiumArea ? 80 : 50;
      const detectionsThisHour = Math.floor((baseTraffic * volumeModifier) + (Math.random() * 20));

      for (let j = 0; j < detectionsThisHour; j++) {
        const isPremiumBrand = screen.isPremiumArea ? Math.random() < 0.35 : Math.random() < 0.05;
        const brandPool = isPremiumBrand ? PREMIUM_BRANDS : BRANDS.filter(b => !PREMIUM_BRANDS.includes(b));
        
        detections.push({
          id: `det-${idCounter++}`,
          timestamp: new Date(currentHourTime.getTime() + Math.random() * 3600000).toISOString(),
          screenId: screen.id,
          screenCommune: screen.commune,
          vehicle: {
            brand: brandPool[Math.floor(Math.random() * brandPool.length)],
            type: ['Sedan', 'SUV', 'Hatchback', 'Camioneta'][Math.floor(Math.random() * 4)],
            year: 2010 + Math.floor(Math.random() * 14)
          }
        });
      }
    });
  }
  return detections;
};

export const recentDetections = generateDetections(24);

export const kpis = {
  totalToday: recentDetections.length,
  uniqueVehicles: Math.floor(recentDetections.length * 0.75),
  uniqueBrands: new Set(recentDetections.map(d => d.vehicle.brand)).size,
  topScreen: SCREENS[0].name,
  peakHour: "18:00 - 19:00"
};

const brandCounts = recentDetections.reduce((acc, curr) => {
  acc[curr.vehicle.brand] = (acc[curr.vehicle.brand] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export const topBrandsData = Object.entries(brandCounts)
  .sort((a, b) => (b[1] as number) - (a[1] as number))
  .slice(0, 10)
  .map(([brand, count]) => ({
    name: brand,
    value: count as number,
    percentage: Math.round(((count as number) / recentDetections.length) * 100)
  }));

export const flowChartData = Array.from({ length: 24 }).map((_, i) => {
  const h = new Date().getHours() - (23 - i);
  const hour = h < 0 ? h + 24 : h;
  const label = `${hour.toString().padStart(2, '0')}:00`;
  
  const count = recentDetections.filter(d => new Date(d.timestamp).getHours() === hour).length;
  
  return {
    time: label,
    vehiculos: count,
    premium: Math.floor(count * 0.15)
  };
});

const typeCounts = recentDetections.reduce((acc, curr) => {
  acc[curr.vehicle.type] = (acc[curr.vehicle.type] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export const vehicleTypesData = Object.entries(typeCounts).map(([name, value]) => ({
  name, value: value as number
}));