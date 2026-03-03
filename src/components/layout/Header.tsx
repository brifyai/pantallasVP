import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Calendar, ChevronDown, Check, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'opportunity',
    title: 'Oportunidad de Ventas',
    message: 'Alta concentración de SUVs Premium en Vitacura. Sugerencia: Ofrecer a marcas automotrices.',
    time: 'Hace 5 min',
    icon: TrendingUp,
    color: 'text-[rgb(var(--accent-lime))]',
    bg: 'bg-[rgba(var(--accent-lime),0.1)]'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Caída de Flujo',
    message: 'Disminución del 15% en el tráfico de la Pantalla Ruta 68 respecto a la semana pasada.',
    time: 'Hace 1 hora',
    icon: AlertTriangle,
    color: 'text-[rgb(var(--accent-magenta))]',
    bg: 'bg-[rgba(var(--accent-magenta),0.1)]'
  },
  {
    id: 3,
    type: 'info',
    title: 'Nueva Pauta Detectada',
    message: 'Competencia activa: Audi comenzó a circular fuerte en el sector de Las Condes Norte.',
    time: 'Hace 3 horas',
    icon: Info,
    color: 'text-[rgb(var(--accent-cyan))]',
    bg: 'bg-[rgba(var(--accent-cyan),0.1)]'
  }
];

const PERIODS = [
  'Últimas 24 Horas',
  'Últimos 7 Días',
  'Este Mes',
  'Mes Anterior',
  'Personalizado...'
];

export function Header() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFICATIONS.length);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
  const dateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = () => {
    setUnreadCount(0);
    setTimeout(() => setIsNotificationsOpen(false), 500);
  };

  const handleSelectPeriod = (period: string) => {
    setSelectedPeriod(period);
    setIsDateOpen(false);
  };

  return (
    <header className="h-20 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,26,0.4)] backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8 relative">
      
      {/* Search Bar */}
      <div className="relative w-96 hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-[rgba(255,255,255,0.1)] rounded-full bg-[rgba(26,26,46,0.5)] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[rgba(var(--accent-cyan),0.5)] focus:ring-1 focus:ring-[rgba(var(--accent-cyan),0.5)] transition-all sm:text-sm"
          placeholder="Buscar marcas, patentes o comunas..."
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-auto md:ml-0">
        
        {/* Date Selector */}
        <div className="relative hidden sm:block" ref={dateRef}>
          <button 
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="flex items-center gap-2 text-gray-300 hover:text-[rgb(var(--accent-cyan))] px-4 py-2 rounded-full border border-[rgba(255,255,255,0.05)] bg-[rgba(26,26,46,0.5)] hover:border-[rgba(var(--accent-cyan),0.3)] transition-all text-sm font-medium focus:outline-none"
          >
            <Calendar size={16} className="text-[rgb(var(--accent-magenta))]" />
            <span>{selectedPeriod}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isDateOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDateOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-4 w-56 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,15,30,0.9)] backdrop-blur-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
              >
                <div className="p-2">
                  {PERIODS.map((period) => (
                    <button
                      key={period}
                      onClick={() => handleSelectPeriod(period)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                        selectedPeriod === period 
                          ? 'bg-[rgba(var(--accent-cyan),0.15)] text-[rgb(var(--accent-cyan))]' 
                          : 'text-gray-300 hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                      }`}
                    >
                      {period}
                      {selectedPeriod === period && (
                        <Check size={16} className="text-[rgb(var(--accent-cyan))]" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none hover:text-[rgb(var(--accent-lime))]"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[rgb(var(--accent-lime))] shadow-[0_0_12px_rgba(var(--accent-lime),0.9)] border-2 border-[rgba(10,10,26,1)]"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-4 w-80 sm:w-96 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,15,30,0.85)] backdrop-blur-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(0,0,0,0.2)]">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    Notificaciones
                    {unreadCount > 0 && (
                      <span className="bg-[rgba(var(--accent-cyan),0.2)] text-[rgb(var(--accent-cyan))] text-xs px-2 py-0.5 rounded-full">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAsRead}
                      className="text-xs text-gray-400 hover:text-[rgb(var(--accent-lime))] transition-colors flex items-center gap-1"
                    >
                      <Check size={14} />
                      Marcar todo
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                  {MOCK_NOTIFICATIONS.map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-4 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer flex gap-4 items-start relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--accent-cyan),0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      
                      <div className={`mt-1 p-2 rounded-full ${notif.bg} flex-shrink-0`}>
                        <notif.icon size={16} className={notif.color} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-medium ${unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {unreadCount === 0 && (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <Bell size={24} className="text-gray-600 mb-2" />
                      <p className="text-sm text-gray-500">Estás al día con tus notificaciones</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-[rgba(0,0,0,0.2)] text-center border-t border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors">
                  <span className="text-xs font-medium text-[rgb(var(--accent-cyan))]">Ver todo el historial</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-[rgba(255,255,255,0.1)] pl-6 cursor-pointer group">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="User" 
              className="w-9 h-9 rounded-full border border-[rgba(var(--accent-cyan),0.3)] object-cover group-hover:border-[rgb(var(--accent-cyan))] transition-colors"
            />
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[rgb(var(--accent-lime))] border-2 border-[#0a0a1a]"></span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white leading-none group-hover:text-[rgb(var(--accent-cyan))] transition-colors">Admin Usuario</p>
            <p className="text-xs text-gray-500 mt-1">Sales Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}