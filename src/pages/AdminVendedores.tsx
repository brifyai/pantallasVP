import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Check,
  X,
  Mail,
  Phone,
  Tag,
  Building2,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';
import { cn } from '../utils/cn';
import { VENDEDORES, Vendedor, getVendedorById, searchVendedores, getMarcasDeVendedor } from '../data/vendedores';
import { MARCAS, getMarcaById } from '../data/marcas';
import { RUBROS, getRubroById } from '../data/rubros';

export function AdminVendedores() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);
  const [expandedVendedor, setExpandedVendedor] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Vendedor>>({
    nombre: '',
    email: '',
    telefono: '',
    marcasIds: [],
    activo: true
  });

  // Filtrar vendedores
  const filteredVendedores = useMemo(() => {
    let result = VENDEDORES;

    if (searchQuery) {
      result = searchVendedores(searchQuery);
    }

    return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [searchQuery]);

  // Contadores
  const counts = useMemo(() => ({
    total: VENDEDORES.filter(v => v.activo).length,
    totalMarcas: MARCAS.filter(m => m.activo).length
  }), []);

  // Manejar cambio de marcas seleccionadas
  const handleMarcaToggle = (marcaId: string) => {
    setFormData(prev => ({
      ...prev,
      marcasIds: prev.marcasIds?.includes(marcaId)
        ? prev.marcasIds.filter(id => id !== marcaId)
        : [...(prev.marcasIds || []), marcaId]
    }));
  };

  // Manejar submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar (actualmente es solo mock)
    setShowForm(false);
    setEditingVendedor(null);
    setFormData({ nombre: '', email: '', telefono: '', marcasIds: [], activo: true });
  };

  // Editar vendedor
  const handleEdit = (vendedor: Vendedor) => {
    setEditingVendedor(vendedor);
    setFormData({
      nombre: vendedor.nombre,
      email: vendedor.email,
      telefono: vendedor.telefono || '',
      marcasIds: [...vendedor.marcasIds],
      activo: vendedor.activo
    });
    setShowForm(true);
  };

  // Cancelar edición
  const handleCancel = () => {
    setShowForm(false);
    setEditingVendedor(null);
    setFormData({ nombre: '', email: '', telefono: '', marcasIds: [], activo: true });
  };

  // Agrupar marcas por rubro para el formulario
  const marcasPorRubro = useMemo(() => {
    const grupos: Record<string, { id: string; nombre: string; seleccionado: boolean }[]> = {};
    
    MARCAS.filter(m => m.activo).forEach(marca => {
      const rubro = getRubroById(marca.rubroId);
      const rubroNombre = rubro?.nombre || 'Otros';
      
      if (!grupos[rubroNombre]) {
        grupos[rubroNombre] = [];
      }
      
      grupos[rubroNombre].push({
        id: marca.id,
        nombre: marca.nombre,
        seleccionado: formData.marcasIds?.includes(marca.id) || false
      });
    });
    
    return grupos;
  }, [formData.marcasIds]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Administración de Vendedores
          </h1>
          <p className="text-gray-400 mt-1">
            Gestiona los vendedores y las marcas asignadas a cada uno
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gradient-to-r from-cyan-500 to-magenta-500 text-white hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Vendedor
        </button>
      </div>

      {/* KPIs Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Vendedores Activos</span>
          </div>
          <p className="text-2xl font-bold text-white">{counts.total}</p>
        </div>
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-magenta-400" />
            <span className="text-xs text-gray-400">Total Marcas</span>
          </div>
          <p className="text-2xl font-bold text-white">{counts.totalMarcas}</p>
        </div>
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Promedio Marcas/Vendedor</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {counts.total > 0 ? Math.round(counts.totalMarcas / counts.total) : 0}
          </p>
        </div>
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Rubros</span>
          </div>
          <p className="text-2xl font-bold text-white">{RUBROS.length}</p>
        </div>
      </div>

      {/* Formulario de Nuevo/Editar Vendedor */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {editingVendedor ? <Edit2 className="w-5 h-5 text-cyan-400" /> : <Plus className="w-5 h-5 text-cyan-400" />}
            {editingVendedor ? 'Editar Vendedor' : 'Nuevo Vendedor'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="juan@flesad.cl"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            {/* Selección de marcas */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Marcas Asignadas</label>
              <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-navy-950 border border-white/10 rounded-lg">
                {Object.entries(marcasPorRubro).map(([rubro, marcas]) => (
                  <div key={rubro}>
                    <h4 className="text-sm font-medium text-gray-300 mb-2 sticky top-0 bg-navy-950 py-1">
                      {rubro}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {marcas.map(marca => (
                        <label
                          key={marca.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                            marca.seleccionado
                              ? "bg-cyan-500/20 border-cyan-500/50"
                              : "bg-navy-900/50 border-white/10 hover:border-white/20"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={marca.seleccionado}
                            onChange={() => handleMarcaToggle(marca.id)}
                            className="w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-white">{marca.nombre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formData.marcasIds?.length || 0} marcas seleccionadas
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 hover:opacity-90 text-white font-medium rounded-lg transition-opacity flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingVendedor ? 'Guardar Cambios' : 'Crear Vendedor'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filtros */}
      <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-2">Buscar Vendedor</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-950 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Buscar por nombre o email..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Vendedores */}
      <div className="space-y-3">
        {filteredVendedores.map((vendedor) => {
          const marcas = vendedor.marcasIds.map(id => getMarcaById(id)).filter(Boolean);
          const isExpanded = expandedVendedor === vendedor.id;

          return (
            <motion.div
              key={vendedor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-navy-900/50 backdrop-blur-md rounded-xl border p-4 transition-all",
                !vendedor.activo ? "opacity-50" : "hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-magenta-500 text-white font-bold text-lg">
                  {vendedor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{vendedor.nombre}</h3>
                        {!vendedor.activo && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          {vendedor.email}
                        </div>
                        {vendedor.telefono && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            {vendedor.telefono}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedVendedor(isExpanded ? null : vendedor.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      <button
                        onClick={() => handleEdit(vendedor)}
                        className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-cyan-400" />
                      </button>
                    </div>
                  </div>

                  {/* Marcas asignadas (resumen) */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {marcas.slice(0, 5).map(marca => (
                      <span
                        key={marca?.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400"
                        style={{ 
                          backgroundColor: marca?.color ? `${marca.color}20` : undefined,
                          color: marca?.color || undefined
                        }}
                      >
                        {marca?.nombre}
                      </span>
                    ))}
                    {marcas.length > 5 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-400">
                        +{marcas.length - 5} más
                      </span>
                    )}
                  </div>

                  {/* Contenido expandido */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Todas las marcas asignadas ({marcas.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {marcas.map(marca => {
                          const rubro = getRubroById(marca?.rubroId || '');
                          return (
                            <div
                              key={marca?.id}
                              className="p-3 bg-navy-950/50 border border-white/10 rounded-lg"
                            >
                              <div
                                className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: marca?.color || '#6b7280' }}
                              >
                                {marca?.nombre.charAt(0).toUpperCase()}
                              </div>
                              <p className="text-sm font-medium text-white truncate">{marca?.nombre}</p>
                              <p className="text-xs text-gray-500 truncate">{rubro?.nombre}</p>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}