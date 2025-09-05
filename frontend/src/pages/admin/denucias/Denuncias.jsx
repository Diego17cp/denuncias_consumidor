"use client"

import { useDenunciasGestion } from "../../../hooks/admin/denuncias/useDenunciasGestion"
import {
  ArrowLeft,
  Search,
  Calendar,
  MapPin,
  User,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Shield,
  FileBox,
  Activity,
} from "lucide-react"
import ModalDetalleDenuncia from "./ModalDetalleDenuncia"
import ModalAgregarDenunciado from "./ModalAgregarDenunciado"
import { Loader } from "dialca-ui"
import { useEffect, useState } from "react"
import { PaginationNav } from "../../../components/PaginationNav"

export const Denuncias = () => {
  // Usa el hook para obtener estados y funciones
  const {
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    selectedDenuncia,
    showDetails,
    setShowDetails,
    newComment,
    setNewComment,
    newStatus,
    setNewStatus,
    searchDocument,
    setSearchDocument,
    searchType,
    setSearchType,
    searchName,
    setSearchName,
    searchDenunciante,
    setSearchDenunciante,
    searchResults,
    expandedFilters,
    setExpandedFilters,
    registeredDenuncias,
    estados,
    filteredDenuncias,
    getStatusStyles,
    mostrarDetalles,
    buscarDenuncias,
    limpiarBusqueda,
    stats,
    fetchRegisteredDenuncias,
    fetchRecievedDenuncias,
    recieveDenuncia,
    isSearching,
    pager,
    handlePageChange,
    getStatistics,
    isLoading,
    isRecieving,
    searchResultsDisponibles,
    searchResultsRecibidas,
    buscarDenunciasPorNombre,
    limpiarBusquedaDisponibles,
    limpiarBusquedaRecibidas
  } = useDenunciasGestion()

  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState(null);

  useEffect(() => {
    getStatistics()
  }, [])

  useEffect(() =>{
    if (activeTab === 'disponibles') fetchRegisteredDenuncias()
    else fetchRecievedDenuncias()
  }, [fetchRegisteredDenuncias, fetchRecievedDenuncias, activeTab])

  // --- Header ---
  const HeaderModulo = () => (
    <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/60 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="cursor-pointer flex items-center space-x-3 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="p-2 rounded-lg   transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Volver al Dashboard</span>
          </button>
          <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Administración de Usuarios
              </h1>
            </div>
        </div>
      </div>
    </header>
  )

  // --- Estadísticas ---
  const EstadisticasModulo = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-600 text-sm font-medium">Pendientes</p>
            <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
          </div>
          <Clock className="h-8 w-8 text-amber-500" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-600 text-sm font-medium">En Proceso</p>
            <p className="text-2xl font-bold text-indigo-900">{stats.in_process}</p>
          </div>
          <Activity className="h-8 w-8 text-indigo-500" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-600 text-sm font-medium">Cerradas</p>
            <p className="text-2xl font-bold text-emerald-900">{stats.closed}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
      </div>
    </div>
  )

  // --- Tabla de denuncias disponibles SIN prioridad ---
  const DenunciaDisponibleTable = ({ denuncias }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Denunciado</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Denunciante</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Fecha</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Lugar</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Descripción</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-registradas-${i}`} className="bg-white">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-36" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-28" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-48" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-56" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              : denuncias.map((denuncia, index) => (
                  <tr
                    key={denuncia.id}
                    className={`hover:bg-slate-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-25"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {denuncia.denunciado?.nombre || denuncia.denunciado}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{denuncia.denunciante?.nombre || denuncia.denunciante}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{denuncia.fecha_incidente || denuncia.fecha}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-sm text-slate-600 max-w-xs">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                        <span className="line-clamp-2">{denuncia.lugar || denuncia.lugarIncidente}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 max-w-md">
                        <p className="line-clamp-2">{denuncia.descripcion || denuncia.detalleIncidente}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => recieveDenuncia(denuncia.tracking_code)}
                        disabled={isRecieving.get(denuncia.tracking_code)}
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
                          isRecieving.get(denuncia.tracking_code)
                            ? "bg-slate-300 text-slate-700 cursor-not-allowed"
                            : "bg-[#002f59]  text-white hover:shadow-md cursor-pointer"
                        }`}
                      >
                        {isRecieving.get(denuncia.tracking_code) ? (
                          <Loader size='sm' />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Recibir
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
        <PaginationNav
          currentPage={pager.registradas.currentPage}
          totalPages={pager.registradas.totalPages}
          onPageChange={(page) => handlePageChange("registradas", page)}
        />
      </div>
    </div>
  )

  const DenunciasRecibidasTable = ({ denuncias, onAgregarDenunciado }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Código</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Denunciado</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Denunciante</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Fecha</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Progreso</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-recibidas-${i}`} className="bg-white">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-28" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-36" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-28" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-20" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              : denuncias.map((denuncia, index) => (
                  <tr
                    key={denuncia.id}
                    className={`hover:bg-slate-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-25"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-primary font-bold text-sm">{denuncia.tracking_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{denuncia.denunciado?.nombre || denuncia.denunciado}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{denuncia.denunciante?.nombre || denuncia.denunciante}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{denuncia.fecha_incidente || denuncia.fecha}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyles(denuncia.estado)}`}
                      >
                        {estados.find((estado) => estado.value === denuncia.estado)?.label || denuncia.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          {/* Muestra el último estado del historial */}
                          <span>
                            {denuncia.historial_count}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FileBox className="h-3 w-3 mr-1" />
                          <span>
                            {Array.isArray(denuncia.adjuntos)
                              ? denuncia.adjuntos.join(", ")
                              : denuncia.adjuntos || ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => mostrarDetalles(denuncia)}
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#002f59] text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detalles
                        </button>
                        <button
                          onClick={() => onAgregarDenunciado(denuncia)}
                          disabled={
                            denuncia.denunciado &&
                            (
                              (typeof denuncia.denunciado === "string" && denuncia.denunciado.trim() !== "" && denuncia.denunciado.toLowerCase() !== "desconocido") ||
                              (typeof denuncia.denunciado === "object" && denuncia.denunciado.nombre && denuncia.denunciado.nombre.trim() !== "" && denuncia.denunciado.nombre.toLowerCase() !== "desconocido")
                            )
                          }
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm
                            ${(
                              denuncia.denunciado &&
                              (
                                (typeof denuncia.denunciado === "string" && denuncia.denunciado.trim() !== "" && denuncia.denunciado.toLowerCase() !== "desconocido") ||
                                (typeof denuncia.denunciado === "object" && denuncia.denunciado.nombre && denuncia.denunciado.nombre.trim() !== "" && denuncia.denunciado.nombre.toLowerCase() !== "desconocido")
                              )
                            )
                              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                              : "bg-[#002f59] text-white hover:shadow-md cursor-pointer"
                            }`}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Añadir denunciado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
        <PaginationNav
          currentPage={pager.recibidas.currentPage}
          totalPages={pager.recibidas.totalPages}
          onPageChange={(page) => handlePageChange("recibidas", page)}
        />
      </div>
    </div>
  )

  const SearchResultsTable = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <h4 className="text-xl font-bold text-slate-900">Resultados de Búsqueda</h4>
        <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
          {searchResults.length} resultados
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Código</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Denunciado</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Documento</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Motivo</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Fecha</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {searchResults.map((denuncia, index) => (
              <tr
                key={denuncia.id}
                className={`hover:bg-slate-50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-25"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="text-primary font-bold text-sm">{denuncia.tracking_code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{denuncia.denunciado.nombre}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 font-mono">{denuncia.denunciado.documento}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyles(denuncia.estado)}`}
                  >
                    {denuncia.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 max-w-md">
                    <p className="line-clamp-2">{denuncia.descripcion}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <span>
                      {denuncia.fecha_incidente}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => mostrarDetalles(denuncia)}
                    className="cursor-pointer inline-flex items-center px-4 py-2 text-white bg-[#002f59] rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <HeaderModulo />
      <EstadisticasModulo />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="flex border-b border-slate-200">
            <button
              className={`cursor-pointer flex-1 py-5 px-6 text-center font-semibold flex items-center justify-center gap-3 transition-all duration-200 ${
                activeTab === "disponibles"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("disponibles")}
            >
              <div className={`p-2 rounded-lg ${activeTab === "disponibles" ? "bg-blue-100" : "bg-slate-100"}`}>
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="cursor-pointer text-left">
                <div>Disponibles</div>
                <div className="text-xs opacity-75">({stats.pending})</div>
              </div>
            </button>
            <button
              className={`cursor-pointer flex-1 py-5 px-6 text-center font-semibold flex items-center justify-center gap-3 transition-all duration-200 ${
                activeTab === "recibidos"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("recibidos")}
            >
              <div className={`p-2 rounded-lg ${activeTab === "recibidos" ? "bg-blue-100" : "bg-slate-100"}`}>
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div>Recibidos</div>
                <div className="text-xs opacity-75">({stats.recieved})</div>
              </div>
            </button>
            <button
              className={`cursor-pointer flex-1 py-5 px-6 text-center font-semibold flex items-center justify-center gap-3 transition-all duration-200 ${
                activeTab === "buscar"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("buscar")}
            >
              <div className={`p-2 rounded-lg ${activeTab === "buscar" ? "bg-blue-100" : "bg-slate-100"}`}>
                <Search className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div>Buscar</div>
                <div className="text-xs opacity-75">Avanzado</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab: Disponibles */}
        {activeTab === "disponibles" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-center text-2xl font-bold text-slate-900">Denuncias Disponibles</h2>
                <p className="text-slate-600 mt-1">Denuncias nuevas pendientes de asignación</p>
              </div>
              <button
                className={`cursor-pointer flex items-center gap-3 px-6 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ${
                  expandedFilters ? "bg-slate-50 border-slate-400" : ""
                }`}
                onClick={() => setExpandedFilters(!expandedFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtros Avanzados
                {expandedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Filtros  */}
            {expandedFilters && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Buscar por nombre del denunciado</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Nombre completo"
                        className="w-full pl-4 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <button
                        onClick={() => buscarDenunciasPorNombre(searchName, "disponibles")}
                        className="cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                        disabled={isSearching || !searchName}
                      >
                        {isSearching ? <Loader size="sm" /> : <Search className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={limpiarBusquedaDisponibles}
                        className="cursor-pointer px-4 py-3 bg-slate-500 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mostrar resultados de búsqueda si existen */}
            {searchResultsDisponibles.length > 0 ? (
              <DenunciaDisponibleTable denuncias={searchResultsDisponibles} />
            ) : (
              registeredDenuncias.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-3">No hay denuncias disponibles</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Todas las denuncias han sido recibidas o no hay nuevas denuncias en el sistema.
                  </p>
                </div>
              ) : (
                <DenunciaDisponibleTable denuncias={registeredDenuncias} />
              )
            )}
          </div>
        )}

        {/* Tab: Recibidos */}
        {activeTab === "recibidos" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-center text-2xl font-bold text-slate-900">Denuncias Recibidas</h2>
                <p className="text-slate-600 mt-1">Denuncias asignadas para seguimiento</p>
              </div>
              <button
                className={`cursor-pointer flex items-center gap-3 px-6 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ${
                  expandedFilters ? "bg-slate-50 border-slate-400" : ""
                }`}
                onClick={() => setExpandedFilters(!expandedFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtros Avanzados
                {expandedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Filtros avanzados*/}
            {expandedFilters && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Estado</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="todos">Todos los estados</option>
                      {estados.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Buscar por nombre del denunciado</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Nombre completo"
                        className="w-full pl-4 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <button
                        onClick={() => buscarDenunciasPorNombre(searchName, "recibidos")}
                        className="cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                        disabled={isSearching || !searchName}
                      >
                        {isSearching ? <Loader size="sm" /> : <Search className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={limpiarBusquedaRecibidas}
                        className="cursor-pointer px-4 py-3 bg-slate-500 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mostrar resultados de búsqueda si existen */}
            {searchResultsRecibidas.length > 0 ? (
              <DenunciasRecibidasTable denuncias={searchResultsRecibidas} onAgregarDenunciado={(denuncia) => {
                (denuncia);
                setModalAgregarOpen(true);
              }} />
            ) : (
              filteredDenuncias.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-3">No se encontraron denuncias</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    No hay denuncias que coincidan con los filtros aplicados
                  </p>
                </div>
              ) : (
                <DenunciasRecibidasTable denuncias={filteredDenuncias} onAgregarDenunciado={(denuncia) => {
                  setDenunciaSeleccionada(denuncia);
                  setModalAgregarOpen(true);
                }} />
              )
            )}
          </div>
        )}

        {/* Tab: Buscar */}
        {activeTab === "buscar" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Búsqueda Avanzada</h3>
                <p className="text-slate-600">Busca denuncias por documento, nombre del denunciado o nombre del denunciante</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Buscar por DNI</label>
                  <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                    <select
                      value={searchType}
                      onChange={e => setSearchType(e.target.value)}
                      className="bg-slate-100 p-3 text-sm border-r border-slate-300 focus:outline-none"
                    >
                      <option value="DNI_DENUNCIADO">Denunciado</option>
                      <option value="DNI_DENUNCIANTE">Denunciante</option>
                    </select>
                    <input
                      type="text"
                      value={searchDocument}
                      onChange={e => setSearchDocument(e.target.value)}
                      placeholder="Ingrese el número de documento"
                      className="flex-1 p-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Nombre del Denunciado</label>
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Nombre completo del denunciado"
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Nombre del Denunciante</label>
                  <input
                    type="text"
                    value={searchDenunciante}
                    onChange={(e) => setSearchDenunciante(e.target.value)}
                    placeholder="Nombre completo del denunciante"
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={buscarDenuncias}
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
                >
                  {isSearching ? <Loader /> : (
                    <>
                      <Search className="h-5 w-5 mr-3" />
                      Buscar Denuncias
                    </>
                  )}
                </button>
                <button
                  onClick={limpiarBusqueda}
                  className="cursor-pointer bg-slate-500 hover:bg-slate-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  Limpiar Búsqueda
                </button>
              </div>
              {searchResults.length === 0 && (searchDocument || searchName || searchDenunciante) && !isSearching && (
                <div className="mt-10 p-8 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-amber-900 mb-2">No se encontraron resultados</h4>
                      <p className="text-amber-800">
                        No hay denuncias que coincidan con los criterios de búsqueda especificados
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-10 w-full">
                <SearchResultsTable />
              </div>
            )}
          </div>
        )}
      </main>

      <ModalDetalleDenuncia
        open={showDetails && selectedDenuncia}
        denuncia={selectedDenuncia}
        newComment={newComment}
        setNewComment={setNewComment}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onClose={() => setShowDetails(false)}
        callback={async () => {
          await getStatistics();
          await fetchRecievedDenuncias();
        }}
      />
      <ModalAgregarDenunciado
        open={modalAgregarOpen}
        onClose={() => setModalAgregarOpen(false)}
        closeModal={() => {
          setModalAgregarOpen(false);
          setDenunciaSeleccionada(null);
        }}
        callback={async () => {
          await fetchRecievedDenuncias();
        }}
        denunciaId={denunciaSeleccionada ? denunciaSeleccionada.id : null}
      />
    </div>
  )
}
