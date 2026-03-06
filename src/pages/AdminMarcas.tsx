import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Filter,
  Tag,
  Briefcase,
  Store,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../utils/cn';
import {
  MARCAS,
  Marca,
  getMarcaById,
  searchMarcas,
  getMarcasByRubro,
  getMarcasByAgencia
} from '../data/marcas';
import { RUBROS, getRubroById, getRubroColor } from '../data/rubros';
import { AGENCIAS, getAgenciaById, getAgenciaColor, isDirecto } from '../data/agencias';
import { VENDEDORES, getVendedorById, getVendedorByMarca } from '../data/vendedores';

export function AdminMarcas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRubro, setFilterRubro] = useState<string>('todos');
  const [filterAgencia, setFilterAgencia] = useState<string>('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
  const [expandedMarca, setExpandedMarca] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Marca>>({
    nombre: '',
    rubroId: '',
    agenciaId: '',
    color: '#000000',
    activo: true
  });

  // Filtrar marcas
  const filteredMarcas = useMemo(() => {
    let result = MARCAS;

    if (searchQuery) {
      result = searchMarcas(searchQuery);
    }

    if (filterRubro !== 'todos') {
      result = result.filter(m => m.rubroId === filterRubro);
    }

    if (filterAgencia !== 'todos') {
      result = result.filter(m => m.agenciaId === filterAgencia);
    }

    return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [searchQuery, filterRubro, filterAgencia]);

  // Contadores
  const counts = useMemo(() => ({
    total: MARCAS.filter(m => m.activo).length,
    porRubro: RUBROS.map(r => ({
      rubro: r,
      count: MARCAS.filter(m => m.activo && m.rubroId === r.id).length
    })),
    porAgencia: AGENCIAS.map(a => ({
      agencia: a,
      count: MARCAS.filter(m => m.activo && m.agenciaId === a.id).length
    }))
  }), []);

  // Manejar submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar (actualmente es solo mock)
    setShowForm(false);
    setEditingMarca(null);
    setFormData({ nombre: '', rubroId: '', agenciaId: '', color: '#000000', activo: true });
  };

  // Editar marca
  const handleEdit = (marca: Marca) => {
    setEditingMarca(marca);
    setFormData({
      nombre: marca.nombre,
      rubroId: marca.rubroId,
      agenciaId: marca.agenciaId,
      color: marca.color || '#000000',
      activo: marca.activo
    });
    setShowForm(true);
  };

  // Cancelar edición
  const handleCancel = () => {
    setShowForm(false);
    setEditingMarca(null);
    setFormData({ nombre: '', rubroId: '', agenciaId: '', color: '#000000', activo: true });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-cyan-400" />
            Administración de Marcas
          </h1>
          <p className="text-gray-400 mt-1">
            Gestiona las marcas, sus rubros y agencias asignadas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gradient-to-r from-cyan-500 to-magenta-500 text-white hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Marca
        </button>
      </div>

      {/* KPIs Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Total Marcas</span>
          </div>
          <p className="text-2xl font-bold text-white">{counts.total}</p>
        </div>
        {counts.porRubro.slice(0, 5).map(({ rubro, count }) => (
          <div
            key={rubro.id}
            className="bg-navy-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
            onClick={() => setFilterRubro(filterRubro === rubro.id ? 'todos' : rubro.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: rubro.color }}
              />
              <span className="text-xs text-gray-400 truncate">{rubro.nombre}</span>
            </div>
            <p className="text-xl font-bold text-white">{count}</p>
          </div>
        ))}
      </div>

      {/* Formulario de Nueva/Editar Marca */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-navy-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {editingMarca ? <Edit2 className="w-5 h-5 text-cyan-400" /> : <Plus className="w-5 h-5 text-cyan-400" />}
            {editingMarca ? 'Editar Marca' : 'Nueva Marca'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre de la Marca</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Ej: Chevrolet"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Color de la Marca</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-white/20"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rubro</label>
                <select
                  value={formData.rubroId}
                  onChange={(e) => setFormData({ ...formData, rubroId: e.target.value })}
                  className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">Seleccionar rubro...</option>
                  {RUBROS.map(rubro => (
                    <option key={rubro.id} value={rubro.id}>{rubro.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Agencia de Medios</label>
                <select
                  value={formData.agenciaId}
                  onChange={(e) => setFormData({ ...formData, agenciaId: e.target.value })}
                  className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">Seleccionar agencia...</option>
                  {AGENCIAS.map(agencia => (
                    <option key={agencia.id} value={agencia.id}>{agencia.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 hover:opacity-90 text-white font-medium rounded-lg transition-opacity flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingMarca ? 'Guardar Cambios' : 'Crear Marca'}
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
            <label className="block text-xs text-gray-400 mb-2">Buscar Marca</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-950 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Buscar por nombre..."
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-2">Filtrar por Rubro</label>
            <select
              value={filterRubro}
              onChange={(e) => setFilterRubro(e.target.value)}
              className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="todos">Todos los rubros</option>
              {RUBROS.map(rubro => (
                <option key={rubro.id} value={rubro.id}>{rubro.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-2">Filtrar por Agencia</label>
            <select
              value={filterAgencia}
              onChange={(e) => setFilterAgencia(e.target.value)}
              className="w-full bg-navy-950 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="todos">Todas las agencias</option>
              {AGENCIAS.map(agencia => (
                <option key={agencia.id} value={agencia.id}>{agencia.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Marcas */}
      <div className="space-y-3">
        {filteredMarcas.map((marca) => {
          const rubro = getRubroById(marca.rubroId);
          const agencia = getAgenciaById(marca.agenciaId);
          const vendedor = getVendedorByMarca(marca.id);
          const isExpanded = expandedMarca === marca.id;

          return (
            <motion.div
              key={marca.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-navy-900/50 backdrop-blur-md rounded-xl border p-4 transition-all",
                !marca.activo ? "opacity-50" : "hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Color de la marca */}
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: marca.color || '#6b7280' }}
                >
                  {marca.nombre.charAt(0).toUpperCase()}
                </div>

                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{marca.nombre}</h3>
                        {!marca.activo && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {rubro && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${rubro.color}20`, color: rubro.color }}
                          >
                            <Tag className="w-3 h-3" />
                            {rubro.nombre}
                          </span>
                        )}
                        {agencia && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${agencia.color}20`, color: agencia.color }}
                          >
                            <Briefcase className="w-3 h-3" />
                            {isDirecto(marca.agenciaId) ? 'Directo' : agencia.nombre.split(' ')[0]}
                          </span>
                        )}
                        {vendedor && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                            <Store className="w-3 h-3" />
                            {vendedor.nombre}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedMarca(isExpanded ? null : marca.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      <button
                        onClick={() => handleEdit(marca)}
                        className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-cyan-400" />
                      </button>
                    </div>
                  </div>

                  {/* Contenido expandido */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Color</p>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: marca.color || '#6b7280' }}
                            />
                            <span className="text-sm text-white">{marca.color || 'N/A'}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Rubro</p>
                          <p className="text-sm text-white">{rubro?.nombre || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Agencia</p>
                          <p className="text-sm text-white">{agencia?.nombre || 'N/A'}</p>
                          {agencia?.contacto && (
                            <p className="text-xs text-gray-500">{agencia.contacto}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Vendedor Asignado</p>
                          <p className="text-sm text-white">{vendedor?.nombre || 'Sin asignar'}</p>
                          {vendedor?.email && (
                            <p className="text-xs text-gray-500">{vendedor.email}</p>
                          )}
                        </div>
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