import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlaceholderViewProps {
  title: string;
  icon: LucideIcon;
  description: string;
}

export function PlaceholderView({ title, icon: Icon, description }: PlaceholderViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-8 flex flex-col items-center justify-center min-h-[75vh]"
    >
      <div className="bg-[rgba(26,26,46,0.8)] backdrop-blur-md p-12 rounded-2xl border border-[rgba(255,255,255,0.05)] flex flex-col items-center max-w-lg text-center relative overflow-hidden">
        {/* Neon Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[rgb(var(--accent-cyan))] to-[rgb(var(--accent-magenta))] opacity-10 blur-[100px] rounded-full z-0"></div>

        <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-[rgb(var(--accent-cyan))] to-[rgb(var(--accent-magenta))] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,0,229,0.3)] rotate-3">
          <Icon size={48} className="text-white -rotate-3" />
        </div>
        
        <h2 className="relative z-10 text-3xl font-bold text-white mb-4 tracking-wide">{title}</h2>
        <p className="relative z-10 text-gray-400 mb-10 text-lg leading-relaxed">{description}</p>
        
        <div className="relative z-10 flex gap-4 bg-[rgba(10,10,26,0.5)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-2 w-16 bg-[rgb(var(--accent-cyan))] rounded-full animate-pulse shadow-[0_0_10px_rgb(var(--accent-cyan))]"></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">In Development</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-2 w-16 bg-[rgb(var(--accent-magenta))] rounded-full animate-pulse delay-75 shadow-[0_0_10px_rgb(var(--accent-magenta))]"></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Phase 2</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-2 w-16 bg-[rgb(var(--accent-lime))] rounded-full animate-pulse delay-150 shadow-[0_0_10px_rgb(var(--accent-lime))]"></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Coming Soon</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}