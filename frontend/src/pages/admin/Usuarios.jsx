import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Key,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  UserCheck,
  Users
} from 'lucide-react';
import ModalUsuario from "./ModalUsuario";
import { useAdmin } from '../../hooks/admin/usuarios/useAdmin';

export function Usuarios() {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const {
    users,
    fetchUsers,
    dniSearch,
    isSearching,
    searchedUser,
    handleSearchDni,
    searchUser,
    updateUser,
  } = useAdmin()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const roles = [
    { value: 'admin', label: 'Administrador', color: 'yellow' },
    { value: 'super_admin', label: 'Super Admin.', color: 'red' }
  ];

  const estados = [
    { value: '1', label: 'Activo', color: 'green' },
    { value: '0', label: 'Inactivo', color: 'red' },
    { value: 'suspendido', label: 'Suspendido', color: 'red' }
  ];

  // Funciones
  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'gray';
  };

  const getStatusColor = (status) => {
    const statusObj = estados.find(s => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  };
  const getStatusLabel = (status) => {
    const statusObj = estados.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Desconocido';
  }

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.dni.includes(searchTerm);
    const matchesRole = roleFilter === 'todos' || user.rol === roleFilter;
    const matchesStatus = statusFilter === 'todos' || user.estado === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedUser(null);
  };

  const toggleUserStatus = (dni, state) => {
    updateUser(dni, "estado", state);
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
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Administración de Usuarios
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'lista', label: 'Lista de Usuarios', icon: Users },
              { key: 'buscar', label: 'Buscar Administrador', icon: Search }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`cursor-pointer flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido según tab */}
        {activeTab === 'lista' && (
          <div>
            {/* Controles superiores */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-stretch gap-4">

                {/* Barra de búsqueda */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full h-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                {/* Filtros */}
                <div className="flex flex-col xs:flex-row gap-2 md:gap-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="todos">Todos los roles</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="todos">Todos los estados</option>
                    {estados.map(estado => (
                      <option key={estado.value} value={estado.value}>{estado.label}</option>
                    ))}
                  </select>
                </div>

                {/* Botón crear */}
                <button
                  onClick={() => openModal('crear')}
                  className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                >
                  <Plus className="cursor-pointer h-5 w-5 mr-2" />
                  Crear Administrador
                </button>
              </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.dni} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.dni}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.rol) === 'blue' ? 'bg-blue-100 text-blue-800' :
                              getRoleColor(user.rol) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                getRoleColor(user.rol) === 'red' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.estado) === 'green' ? 'bg-green-100 text-green-800' :
                              getStatusColor(user.estado) === 'gray' ? 'bg-gray-100 text-gray-800' :
                                getStatusColor(user.estado) === 'red' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {getStatusLabel(user.estado)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openModal('password', user)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Cambiar contraseña"
                            >
                              <Key className="cursor-pointer h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal('role', user)}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                              title="Cambiar rol"
                            >
                              <Edit className="cursor-pointer h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.dni, user.estado === "1" ? "0" : "1")}
                              className={`p-2 rounded-lg transition-colors ${user.estado === '1'
                                  ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                  : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                              title={user.estado === '1' ? 'Desactivar' : 'Activar'}
                            >
                              {user.estado === '1' ?
                                <ToggleRight className="cursor-pointer h-4 w-4" /> :
                                <ToggleLeft className="cursor-pointer h-4 w-4" />
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab de buscar administrador */}
        {activeTab === 'buscar' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Buscar Administrador</h3>
                <p className="text-sm text-gray-500 mt-1">Ingresa el DNI para buscar un administrador específico</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                  <input
                    type="text"
                    value={dniSearch}
                    onChange={handleSearchDni}
                    placeholder="Ingresa el DNI..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => {
                    if (dniSearch.length === 8) searchUser()
                  }}
                  disabled={isSearching || !dniSearch.trim()}
                  className="
                  cursor-pointer w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </button>

                {/* Resultado de búsqueda */}
                {/* TODO: MEJORA ESTO PETUSO */}
                {searchedUser && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-green-900">Administrador Encontrado</h4>
                    </div>
                    <div className="space-y-1 text-sm text-green-800">
                      <p><strong>DNI:</strong> {searchedUser.dni}</p>
                      <p><strong>Nombre:</strong> {searchedUser.nombre}</p>
                      <p><strong>Rol:</strong> {searchedUser.rol === "super_admin" ? "Super Admin.": "Admin"}</p>
                      <p><strong>Estado:</strong> {searchedUser.estado === "1" ? "Activo" : "Inactivo"}</p>
                    </div>
                  </div>
                )}

                {dniSearch.dni && searchedUser === null && !isSearching && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <h4 className="font-medium text-red-900">No encontrado</h4>
                    </div>
                    <p className="text-sm text-red-800 mt-1">No se encontró ningún administrador con el DNI ingresado.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <ModalUsuario
        open={showModal}
        modalType={modalType}
        selectedUser={selectedUser}
        roles={roles}
        closeModal={closeModal}
      />
    </div>
  );
}