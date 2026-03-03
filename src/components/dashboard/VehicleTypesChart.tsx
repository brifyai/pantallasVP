import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface VehicleTypesChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = [
  'rgb(var(--accent-cyan))', 
  'rgb(var(--accent-magenta))', 
  'rgb(var(--accent-lime))', 
  '#f59e0b'
];

export function VehicleTypesChart({ data }: VehicleTypesChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-navy-900/50 backdrop-blur-md p-6 col-span-1 border border-white/10 rounded-xl"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">Segmentación por Tipo</h2>
        <p className="text-xs text-gray-400">Distribución global del parque automotriz</p>
      </div>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(26,26,46,0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
              labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none" style={{ top: '-10%' }}>
          <span className="text-2xl font-bold text-white">{data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}</span>
          <span className="text-xs text-gray-400">Total</span>
        </div>
      </div>
    </motion.div>
  );
}