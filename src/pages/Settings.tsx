import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Key, 
  Shield, 
  Database,
  Smartphone,
  Mail,
  Moon,
  Zap,
  CheckCircle2
} from 'lucide-react';

import { useState } from 'react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkTheme, setDarkTheme] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  // Tab states
  const [notifStates, setNotifStates] = useState([true, true, false, true]);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const toggleNotif = (index: number) => {
    const newStates = [...notifStates];
    newStates[index] = !newStates[index];
    setNotifStates(newStates);
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      key={activeTab}
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="text-[rgb(var(--accent-cyan))]" size={32} />
            Configuración del Sistema
          </h2>
          <p className="text-gray-400">Gestiona tus preferencias, integraciones y perfil de usuario.</p>
        </div>
        <motion.button 
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[rgb(var(--accent-cyan))] to-[rgb(var(--accent-magenta))] text-white font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
        >
          <CheckCircle2 size={18} />
          Guardar Cambios
        </motion.button>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 bg-[rgba(0,229,255,0.2)] border border-[rgb(var(--accent-cyan))] text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-[0_0_15px_rgba(0,229,255,0.4)] z-50 backdrop-blur-md"
          >
            <CheckCircle2 size={20} className="text-[rgb(var(--accent-cyan))]" />
            Cambios guardados con éxito
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation/Sections */}
        <div className="space-y-4">
          <motion.div variants={item} className="p-1 rounded-2xl bg-[rgba(26,26,46,0.5)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]">
            {[
              { id: 'profile', icon: User, label: 'Perfil de Usuario' },
              { id: 'notifications', icon: Bell, label: 'Notificaciones' },
              { id: 'security', icon: Shield, label: 'Seguridad' },
              { id: 'api', icon: Key, label: 'API & Integraciones' },
              { id: 'data', icon: Database, label: 'Gestión de Datos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[rgba(var(--accent-cyan),0.15)] to-transparent border-l-2 border-[rgb(var(--accent-cyan))] text-white' 
                    : 'text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-white'
                }`}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'text-[rgb(var(--accent-cyan))]' : ''} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'profile' && (
            <>
              {/* Profile Section */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]">
            <h3 className="text-xl font-semibold text-white mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
              Información Personal
            </h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[rgb(var(--accent-cyan))] to-[rgb(var(--accent-magenta))] p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center text-3xl font-bold">
                  JS
                </div>
              </div>
              <div>
                <button className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-medium transition-colors mb-2">
                  Cambiar Avatar
                </button>
                <p className="text-xs text-gray-400">JPG, GIF o PNG. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Nombre Completo</label>
                <input 
                  type="text" 
                  defaultValue="Juan Silva"
                  className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Cargo</label>
                <input 
                  type="text" 
                  defaultValue="Sales Director"
                  className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="email" 
                    defaultValue="jsilva@flesad.cl"
                    className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Teléfono</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="tel" 
                    defaultValue="+56 9 1234 5678"
                    className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))] transition-colors"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]">
            <h3 className="text-xl font-semibold text-white mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
              Preferencias de Interfaz
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-gray-300">
                    <Moon size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Tema Oscuro</h4>
                    <p className="text-sm text-gray-400">Activa o desactiva el modo nocturno.</p>
                  </div>
                </div>
                <div 
                  onClick={() => setDarkTheme(!darkTheme)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${darkTheme ? 'bg-[rgb(var(--accent-cyan))]' : 'bg-gray-600'}`}
                >
                  <motion.div 
                    animate={{ x: darkTheme ? 24 : 0 }}
                    className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-gray-300">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Animaciones Fluidas</h4>
                    <p className="text-sm text-gray-400">Reduce el movimiento si experimentas lag.</p>
                  </div>
                </div>
                <div 
                  onClick={() => setAnimations(!animations)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${animations ? 'bg-[rgb(var(--accent-cyan))]' : 'bg-gray-600'}`}
                >
                  <motion.div 
                    animate={{ x: animations ? 24 : 0 }}
                    className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
          </>
          )}

          {activeTab === 'notifications' && (
            <motion.div variants={item} className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] space-y-8">
              <h3 className="text-xl font-semibold text-white border-b border-[rgba(255,255,255,0.05)] pb-4">
                Configuración de Notificaciones
              </h3>
              
              <div className="space-y-6">
                {[
                  { title: 'Alertas de Tráfico Anómalo', desc: 'Recibe un aviso si el flujo vehicular cae o sube un 50% repentinamente.' },
                  { title: 'Resumen Diario de Ventas', desc: 'Un email cada mañana con las oportunidades de venta detectadas.' },
                  { title: 'Detección de Nueva Competencia', desc: 'Aviso instantáneo cuando una marca competidora empieza a ser detectada.' },
                  { title: 'Notificaciones Push Móviles', desc: 'Enviar alertas directamente a tu dispositivo móvil configurado.' }
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{notif.title}</h4>
                      <p className="text-sm text-gray-400">{notif.desc}</p>
                    </div>
                    <div 
                      onClick={() => toggleNotif(i)}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifStates[i] ? 'bg-[rgb(var(--accent-cyan))]' : 'bg-gray-600'}`}
                    >
                      <motion.div animate={{ x: notifStates[i] ? 24 : 0 }} className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div variants={item} className="space-y-6">
              <div className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]">
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
                  Cambiar Contraseña
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Contraseña Actual</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Nueva Contraseña</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))] transition-colors" />
                  </div>
                </div>
                <button className="mt-6 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-medium transition-colors">
                  Actualizar Contraseña
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]">
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
                  Autenticación de Dos Factores (2FA)
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">App de Autenticación</h4>
                    <p className="text-sm text-gray-400">Añade una capa extra de seguridad a tu cuenta usando Google Authenticator o Authy.</p>
                  </div>
                  <div 
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${twoFactorAuth ? 'bg-[rgb(var(--accent-cyan))]' : 'bg-gray-600'}`}
                  >
                    <motion.div animate={{ x: twoFactorAuth ? 24 : 0 }} className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div variants={item} className="space-y-6">
              <div className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]">
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
                  Claves de API
                </h3>
                <p className="text-sm text-gray-400 mb-4">Utiliza esta clave para acceder a los datos de Flesad desde tus propias aplicaciones.</p>
                <div className="flex items-center gap-4">
                  <input type="text" readOnly value="sk_live_98f7a8s9df789asdf798asdf" className="flex-1 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none" />
                  <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-[rgb(var(--accent-cyan))] to-[rgb(var(--accent-magenta))] text-white font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                    Copiar
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]">
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
                  Webhooks
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">URL del Endpoint</label>
                  <input type="url" placeholder="https://tu-dominio.com/api/webhook" className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))] transition-colors" />
                </div>
                <button className="mt-4 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-medium transition-colors">
                  Guardar Endpoint
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div variants={item} className="p-6 rounded-2xl bg-[rgba(26,26,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] space-y-8">
              <h3 className="text-xl font-semibold text-white border-b border-[rgba(255,255,255,0.05)] pb-4">
                Gestión de Datos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                  <h4 className="text-white font-medium mb-2">Exportar Analíticas</h4>
                  <p className="text-sm text-gray-400 mb-4">Descarga todo el histórico de capturas en formato CSV para análisis externo.</p>
                  <button className="w-full py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-medium transition-colors">
                    Descargar CSV
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                  <h4 className="text-white font-medium mb-2">Política de Retención</h4>
                  <p className="text-sm text-gray-400 mb-4">Configura cuánto tiempo se almacenarán las capturas antes de ser anonimizadas.</p>
                  <select className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgb(var(--accent-cyan))]">
                    <option>30 días</option>
                    <option>90 días</option>
                    <option>6 meses</option>
                    <option>1 año</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-[rgba(255,255,255,0.05)]">
                <h4 className="text-red-400 font-medium mb-2">Zona de Peligro</h4>
                <p className="text-sm text-gray-400 mb-4">Estas acciones son irreversibles y afectarán el rendimiento del dashboard.</p>
                <button className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium transition-colors">
                  Limpiar Caché de Redis
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}