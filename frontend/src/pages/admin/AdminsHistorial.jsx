import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Clock,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  UserPlus,
  UserMinus,
  Key,
  Edit,
  Trash2,
  Activity,
  FileText,
} from 'lucide-react';
import ModalDetalleHistorial from "./ModalDetalleHistorial";

export function AdminsHistorial() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('todas');
  const [adminFilter, setAdminFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('todos');
  const [showDetails, setShowDetails] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);

  // Datos simulados del historial
  const [historialData] = useState([
    {
      id: 1,
      usuarioAfectado: { dni: '12345678', nombre: 'Juan Pérez García' },
      administrador: { dni: '87654321', nombre: 'María González López' },
      accion: 'crear_usuario',
      fecha: '2024-08-21T10:30:00',
    },
    {
      id: 2,
      usuarioAfectado: { dni: '11111111', nombre: 'Carlos Rodríguez Sánchez' },
      administrador: { dni: '87654321', nombre: 'María González López' },
      accion: 'cambiar_rol',
      fecha: '2024-08-21T09:15:00',
    },
    {
      id: 3,
      usuarioAfectado: { dni: '22222222', nombre: 'Ana Martínez Fernández' },
      administrador: { dni: '12345678', nombre: 'Juan Pérez García' },
      accion: 'suspender_usuario',
      fecha: '2024-08-20T16:45:00',
    },
    {
      id: 4,
      usuarioAfectado: { dni: '33333333', nombre: 'Luis Torres Jiménez' },
      administrador: { dni: '87654321', nombre: 'María González López' },
      accion: 'cambiar_password',
      fecha: '2024-08-20T14:20:00',
    },
    {
      id: 5,
      usuarioAfectado: { dni: '44444444', nombre: 'Carmen Silva Morales' },
      administrador: { dni: '12345678', nombre: 'Juan Pérez García' },
      accion: 'eliminar_usuario',
      fecha: '2024-08-19T11:30:00',
    },
    {
      id: 6,
      usuarioAfectado: { dni: '55555555', nombre: 'Roberto Vega Castro' },
      administrador: { dni: '87654321', nombre: 'María González López' },
      accion: 'activar_usuario',
      fecha: '2024-08-19T08:15:00',
    }
  ]);

  // Configuración de acciones
  const tiposAccion = {
    crear_usuario: { label: 'Crear Usuario', icon: UserPlus, color: 'green' },
    cambiar_rol: { label: 'Cambiar Rol', icon: Shield, color: 'blue' },
    cambiar_password: { label: 'Cambiar Contraseña', icon: Key, color: 'yellow' },
    suspender_usuario: { label: 'Suspender Usuario', icon: UserMinus, color: 'red' },
    activar_usuario: { label: 'Activar Usuario', icon: CheckCircle, color: 'green' },
    eliminar_usuario: { label: 'Eliminar Usuario', icon: Trash2, color: 'red' },
    editar_usuario: { label: 'Editar Usuario', icon: Edit, color: 'blue' }
  };


  // Funciones de filtrado
  const filteredData = historialData.filter(entry => {
    const matchesSearch =
      entry.usuarioAfectado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.usuarioAfectado.dni.includes(searchTerm) ||
      entry.administrador.nombre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === 'todas' || entry.accion === actionFilter;
    const matchesAdmin = adminFilter === 'todos' || entry.administrador.dni === adminFilter;

    const matchesDate = (() => {
      if (dateFilter === 'todos') return true;
      const entryDate = new Date(entry.fecha);
      const today = new Date();

      switch (dateFilter) {
        case 'hoy':
          return entryDate.toDateString() === today.toDateString();
        case 'ayer':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return entryDate.toDateString() === yesterday.toDateString();
        case 'semana':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate >= weekAgo;
        case 'mes':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return entryDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesAction && matchesAdmin && matchesDate;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionConfig = (action) => {
    return tiposAccion[action] || { label: action, icon: Activity, color: 'gray' };
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Volver al Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Historial de Administradores
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 gap-4">

            {/* Barra de búsqueda */}
            <div className="relative lg:w-[70%] w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por usuario, admin o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Filtro 1 */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="cursor-pointer lg:w-[15%] w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="todas">Todas las acciones</option>
              {Object.entries(tiposAccion).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>

            {/* Filtro 2 */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="cursor-pointer lg:w-[15%] w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="todos">Todas las fechas</option>
              <option value="hoy">Hoy</option>
              <option value="ayer">Ayer</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>

          </div>
        </div>


        {/* Tabla de historial */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario Afectado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((entry) => {
                  const actionConfig = getActionConfig(entry.accion);
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{entry.usuarioAfectado.nombre}</div>
                            <div className="text-sm text-gray-500">DNI: {entry.usuarioAfectado.dni}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Shield className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{entry.administrador.nombre}</div>
                            <div className="text-sm text-gray-500">DNI: {entry.administrador.dni}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${actionConfig.color === 'green' ? 'bg-green-100' :
                              actionConfig.color === 'blue' ? 'bg-blue-100' :
                                actionConfig.color === 'yellow' ? 'bg-yellow-100' :
                                  actionConfig.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                            <actionConfig.icon className={`h-4 w-4 ${actionConfig.color === 'green' ? 'text-green-600' :
                                actionConfig.color === 'blue' ? 'text-blue-600' :
                                  actionConfig.color === 'yellow' ? 'text-yellow-600' :
                                    actionConfig.color === 'red' ? 'text-red-600' : 'text-gray-600'
                              }`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{actionConfig.label}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{formatDate(entry.fecha)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.accion === 'eliminar_usuario' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                          {entry.accion === 'eliminar_usuario' ? (
                            <XCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {getActionConfig(entry.accion).label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowDetails(entry)}
                            className="cursor-pointer p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="cursor-pointer ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredData.length}</span> de{' '}
                  <span className="font-medium">{historialData.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de detalles */}
      <ModalDetalleHistorial
        open={!!showDetails}
        detalles={showDetails}
        getActionConfig={getActionConfig}
        formatDate={formatDate}
        onClose={() => setShowDetails(null)}
      />
    </div>
  );
}