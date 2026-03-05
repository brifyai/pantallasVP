import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface LiveFlowChartProps {
  data: Array<{ time: string; vehiculos: number; premium: number }>;
}

export function LiveFlowChart({ data }: LiveFlowChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-navy-900/50 backdrop-blur-md p-4 md:p-6 col-span-1 lg:col-span-2 border border-white/10 rounded-xl relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            Flujo Vehicular en Tiempo Real
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </h2>
          <p className="text-[10px] md:text-xs text-gray-400">Últimas 24 horas - Todas las pantallas</p>
        </div>
        <div className="flex gap-3 md:gap-4 text-[10px] md:text-xs font-medium">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[rgb(var(--accent-cyan))] shadow-[0_0_8px_rgba(var(--accent-cyan),0.8)]"></div>
            <span className="text-gray-300 hidden sm:inline">Total Vehículos</span>
            <span className="text-gray-300 sm:hidden">Total</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[rgb(var(--accent-magenta))] shadow-[0_0_8px_rgba(var(--accent-magenta),0.8)]"></div>
            <span className="text-gray-300 hidden sm:inline">Segmento Premium</span>
            <span className="text-gray-300 sm:hidden">Premium</span>
          </div>
        </div>
      </div>

      <div className="h-56 md:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--accent-cyan))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(var(--accent-cyan))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--accent-magenta))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(var(--accent-magenta))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(26,26,46,0.95)', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
              labelStyle={{ color: '#00e5ff', fontWeight: 600, marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="vehiculos" 
              stroke="rgb(var(--accent-cyan))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
              activeDot={{ r: 6, fill: "rgb(var(--accent-cyan))", stroke: "#fff", strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="premium" 
              stroke="rgb(var(--accent-magenta))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPremium)" 
              activeDot={{ r: 6, fill: "rgb(var(--accent-magenta))", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}