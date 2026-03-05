// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  Map,
  MonitorPlay,
  TrendingUp,
  History,
  LogOut,
  Settings,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { path: '/brand', icon: BarChart2, label: 'Brand Intelligence' },
  { path: '/screen', icon: MonitorPlay, label: 'Screen Performance' },
  { path: '/geo', icon: Map, label: 'Geo Intelligence' },
  { path: '/sales', icon: TrendingUp, label: 'Sales Intelligence' },
  { path: '/time', icon: History, label: 'Time Machine' },
];

interface SidebarProps {
  activeView: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ activeView, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const sidebarClasses = isMobileOpen
    ? 'mobile-sidebar active'
    : 'hidden md:flex w-64 h-screen border-r border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,26,0.4)] backdrop-blur-xl flex-col justify-between fixed left-0 top-0 z-50';

  return (
    <div className={sidebarClasses}>
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--accent-cyan))] to-[rgb(var(--accent-magenta))] flex items-center justify-center font-bold text-white text-xl">
              F
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-white font-black text-xl leading-none tracking-wider uppercase">
                Flesad
              </h1>
              <span className="text-[10px] text-[rgb(var(--accent-cyan))] font-bold uppercase tracking-[0.3em] mt-0.5">Analytics</span>
            </div>
          </div>
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.path}
                key={item.path}
                onClick={isMobileOpen ? onCloseMobile : undefined}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[rgba(var(--accent-cyan),0.15)] to-transparent border-l-2 border-[rgb(var(--accent-cyan))] text-white'
                      : 'text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={isActive ? 'text-[rgb(var(--accent-cyan))]' : ''} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[rgba(255,255,255,0.05)] space-y-2">
        <NavLink
          to="/settings"
          onClick={isMobileOpen ? onCloseMobile : undefined}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[rgba(var(--accent-cyan),0.15)] to-transparent border-l-2 border-[rgb(var(--accent-cyan))] text-white'
                : 'text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={20} className={isActive ? 'text-[rgb(var(--accent-cyan))]' : ''} />
              <span className="font-medium text-sm">Configuración</span>
            </>
          )}
        </NavLink>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-rose-400 transition-all">
          <LogOut size={20} />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}