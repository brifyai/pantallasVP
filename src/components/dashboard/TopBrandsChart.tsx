import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface TopBrandsChartProps {
  data: Array<{ name: string; value: number; percentage: number }>;
}

export function TopBrandsChart({ data }: TopBrandsChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-navy-900/50 backdrop-blur-md p-6 col-span-1 border border-white/10 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy size={18} className="text-[rgb(var(--accent-lime))]" />
            Top 10 Marcas
          </h2>
          <p className="text-xs text-gray-400">Participación en las últimas 24h</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 30, left: -20, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#d1d5db', fontSize: 12 }} 
              width={100}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{
                backgroundColor: 'rgba(26,26,46,0.95)',
                borderColor: 'rgba(0,255,136,0.3)',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#00ff88', fontWeight: 500 }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}
              formatter={(value: any) => [`${value} vehículos`, 'Capturas']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((_entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`rgba(var(--accent-lime), ${1 - index * 0.08})`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}