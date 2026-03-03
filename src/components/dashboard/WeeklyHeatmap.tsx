import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

export function WeeklyHeatmap() {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  
  // Mock data for heatmap intensity (0.1 to 1)
  const generateIntensity = (dayIdx: number, hourIdx: number) => {
    // Peak hours morning (08:00) and evening (18:00) on weekdays
    if (dayIdx < 5) {
      if (hourIdx === 0 || hourIdx === 5) return 0.8 + Math.random() * 0.2; // 0.8 - 1.0
      if (hourIdx === 1 || hourIdx === 4) return 0.5 + Math.random() * 0.3;
      return 0.3 + Math.random() * 0.2;
    }
    // Weekends peak around noon (12:00 - 14:00)
    if (hourIdx === 2 || hourIdx === 3) return 0.7 + Math.random() * 0.2;
    return 0.2 + Math.random() * 0.3;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-navy-900/50 backdrop-blur-md p-6 col-span-1 lg:col-span-2 border border-white/10 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon size={18} className="text-[rgb(var(--accent-cyan))]" />
            Heatmap Semanal
          </h2>
          <p className="text-xs text-gray-400">Intensidad de tráfico por día y hora</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Bajo</span>
          <div className="flex gap-1">
            {[0.2, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
              <div key={i} className="w-4 h-4 rounded-sm bg-[rgb(var(--accent-cyan))]" style={{ opacity }}></div>
            ))}
          </div>
          <span>Alto</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header (Hours) */}
          <div className="flex ml-12 mb-2">
            {hours.map((hour, i) => (
              <div key={i} className="flex-1 text-center text-xs text-gray-500 font-medium">
                {hour}
              </div>
            ))}
          </div>

          {/* Grid Rows (Days) */}
          <div className="space-y-2">
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="flex items-center group">
                <div className="w-12 text-xs text-gray-400 font-medium group-hover:text-white transition-colors">
                  {day}
                </div>
                <div className="flex-1 flex gap-2">
                  {hours.map((_, hourIdx) => {
                    const intensity = generateIntensity(dayIdx, hourIdx);
                    return (
                      <div 
                        key={`${dayIdx}-${hourIdx}`} 
                        className="flex-1 h-8 rounded-md bg-[rgb(var(--accent-cyan))] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_10px_rgba(var(--accent-cyan),0.5)] cursor-pointer"
                        style={{ opacity: intensity }}
                        title={`${day} a las ${hours[hourIdx]} - Intensidad: ${Math.round(intensity * 100)}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}