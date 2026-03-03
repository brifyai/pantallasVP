import { motion } from 'framer-motion';
import { Activity, Car, Tags, MapPin, Clock } from 'lucide-react';

interface KPICardsProps {
  data: {
    totalToday: number;
    uniqueVehicles: number;
    uniqueBrands: number;
    topScreen: string;
    peakHour: string;
  };
}

export function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      title: 'Total Capturas Hoy',
      value: data.totalToday.toLocaleString(),
      icon: Activity,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-500/20',
      trend: '+12.5%'
    },
    {
      title: 'Vehículos Únicos',
      value: data.uniqueVehicles.toLocaleString(),
      icon: Car,
      color: 'text-[rgb(var(--accent-lime))]',
      bg: 'bg-[rgb(var(--accent-lime))]/10',
      border: 'border-[rgba(var(--accent-lime),0.2)]',
      trend: '+8.2%'
    },
    {
      title: 'Marcas Únicas',
      value: data.uniqueBrands,
      icon: Tags,
      color: 'text-[rgb(var(--accent-magenta))]',
      bg: 'bg-[rgb(var(--accent-magenta))]/10',
      border: 'border-[rgba(var(--accent-magenta),0.2)]',
      trend: '0%'
    },
    {
      title: 'Pantalla más Activa',
      value: "Las Condes", // Mocked for display as requested "Pantalla de Las Condes"
      icon: MapPin,
      color: 'text-[rgb(var(--accent-cyan))]',
      bg: 'bg-[rgb(var(--accent-cyan))]/10',
      border: 'border-[rgba(var(--accent-cyan),0.2)]',
      trend: 'Estable'
    },
    {
      title: 'Hora Pico',
      value: data.peakHour,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-500/20',
      trend: 'Tendencia'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          className="bg-navy-900/50 backdrop-blur-md p-5 border border-white/10 rounded-xl relative overflow-hidden group"
        >
          {/* Neon glow effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/5 text-gray-300">
              {card.trend}
            </span>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}