import React, { useEffect, useState } from "react";
import {
	ArrowLeft,
	Search,
	Clock,
	User,
	Shield,
	Eye,
	UserPlus,
	Edit,
	Activity,
	FileText,
} from "lucide-react";
import ModalDetalleHistorial from "./ModalDetalleHistorial";
import axios from "axios";

export function AdminsHistorial() {
	const API_URL = import.meta.env.VITE_CI_API_BASE_URL;

	const [searchTerm, setSearchTerm] = useState("")
	const [actionFilter, setActionFilter] = useState("todas");
	const [adminFilter] = useState("todos");
	const [dateFilter, setDateFilter] = useState("todos");
	const [showDetails, setShowDetails] = useState(null);
	// Datos simulados del historial
	const [historialData, setHistorialData] = useState([]);
	const [pager, setPager] = useState({
		currentPage: 1,
		totalPages: 1,
		total: 0,
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchHistorial = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(
					`${API_URL}/admin/historial?page=${pager.currentPage}`,
					{
						withCredentials: true,
					}
				);
				if (response.data.success || response.status === 200) {
					const data = response.data.data;
					setHistorialData(data);
					const pager = response.data.pager;
					setPager({
						currentPage: pager.currentPage,
						totalPages: pager.totalPages,
						total: pager.total,
					});
				} else {
					setHistorialData([]);
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					setHistorialData([]);
					console.error(
						"Error fetching historial data:",
						error.message
					);
				}
				console.error(
					"Unexpected error fetching historial data:",
					error
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchHistorial();
	}, [API_URL, pager.currentPage]);

	// Configuración de acciones
	const tiposAccion = {
		crear: { label: "Creación", icon: UserPlus, color: "green" },
		actualizar: { label: "Actualización", icon: Edit, color: "blue" },
	};

	// helpers para parse/compare fechas
	const parseDateSafe = (dateString) => {
		if (!dateString) return null;
		// normalizar "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
		let normalized = String(dateString).trim().replace(" ", "T");
		let d = new Date(normalized);
		if (isNaN(d.getTime())) {
			// fallback: cambiar - por / (compatibilidad)
			d = new Date(String(dateString).trim().replace(/-/g, "/"));
			if (isNaN(d.getTime())) return null;
		}
		return d;
	};

	const startOfDay = (d) => {
		const c = new Date(d);
		c.setHours(0, 0, 0, 0);
		return c;
	};

	const endOfDay = (d) => {
		const c = new Date(d);
		c.setHours(23, 59, 59, 999);
		return c;
	};

	// Opciones derivadas (para selects si las usas)
	const actionOptions = React.useMemo(
		() =>
			[{ value: "todas", label: "Todas las acciones" }].concat(
				Object.keys(tiposAccion).map((k) => ({
					value: k,
					label: tiposAccion[k].label,
				}))
			),
		[tiposAccion]
	);

	const adminOptions = React.useMemo(() => {
		const map = new Map();
		historialData.forEach((e) => {
			if (e.dni_administrador)
				map.set(e.dni_administrador, e.nombre_administrador);
		});
		return [{ value: "todos", label: "Todos los administradores" }].concat(
			Array.from(map.entries()).map(([dni, nombre]) => ({
				value: dni,
				label: `${nombre} — ${dni}`,
			}))
		);
	}, [historialData]);

	// Filtrado robusto y memoizado
	const filteredData = React.useMemo(() => {
		const q = (searchTerm || "").trim().toLowerCase();

		// rango de fechas para filtros relativos
		const today = new Date();
		const todayStart = startOfDay(today);
		const todayEnd = endOfDay(today);
		const yesterdayStart = startOfDay(
			new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
		);
		const yesterdayEnd = endOfDay(
			new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
		);
		const weekAgo = new Date(today);
		weekAgo.setDate(weekAgo.getDate() - 7);
		const monthAgo = new Date(today);
		monthAgo.setMonth(monthAgo.getMonth() - 1);

		return (
			historialData
				.filter((entry) => {
					// campos seguros
					const nombreAfectado = (
						entry.nombre_afectado || ""
					).toLowerCase();
					const dniAfectado = String(entry.dni_afectado || "");
					const nombreAdmin = (
						entry.nombre_administrador || ""
					).toLowerCase();
					const dniAdmin = String(entry.dni_administrador || "");

					// búsqueda
					const matchesSearch =
						q === "" ||
						nombreAfectado.includes(q) ||
						dniAfectado.includes(q) ||
						nombreAdmin.includes(q) ||
						dniAdmin.includes(q) ||
						(entry.motivo || "").toLowerCase().includes(q);

					if (!matchesSearch) return false;

					// acción
					if (
						actionFilter &&
						actionFilter !== "todas" &&
						entry.accion !== actionFilter
					)
						return false;

					// admin
					if (
						adminFilter &&
						adminFilter !== "todos" &&
						entry.dni_administrador !== adminFilter
					)
						return false;

					// fecha
					if (dateFilter && dateFilter !== "todos") {
						const entryDate = parseDateSafe(
							entry.created_at || entry.fecha
						);
						if (!entryDate) return false;
						switch (dateFilter) {
							case "hoy":
								return (
									entryDate >= todayStart &&
									entryDate <= todayEnd
								);
							case "ayer":
								return (
									entryDate >= yesterdayStart &&
									entryDate <= yesterdayEnd
								);
							case "semana":
								return entryDate >= weekAgo;
							case "mes":
								return entryDate >= monthAgo;
							default:
								return true;
						}
					}

					return true;
				})
				// ordenar por fecha descendente para mostrar lo más reciente primero
				.sort((a, b) => {
					const da =
						parseDateSafe(a.created_at || a.fecha) || new Date(0);
					const db =
						parseDateSafe(b.created_at || b.fecha) || new Date(0);
					return db - da;
				})
		);
	}, [historialData, searchTerm, actionFilter, adminFilter, dateFilter]);

	// formato de fecha robusto
	const formatDate = (dateString) => {
		if (!dateString) return "-";
		const normalized = String(dateString).replace(" ", "T");
		const d = new Date(normalized);
		if (isNaN(d.getTime())) {
			// fallback: intentar reemplazar espacios y colons, o devolver original
			try {
				const alt = new Date(dateString.replace(/-/g, "/"));
				if (!isNaN(alt.getTime())) {
					return alt.toLocaleString("es-ES", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					});
				}
			} catch (e) {}
			return dateString;
		}
		return d.toLocaleString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const getActionConfig = (action, motivo) => {
		// intenta resolver con tiposAccion; si no existe, devuelve genérico.
		const base = tiposAccion[action] || {
			label: action,
			icon: Activity,
			color: "gray",
		};
		// personalizar label para acciones genéricas crear/actualizar si hay motivo
		if ((action === "crear" || action === "actualizar") && motivo) {
			return {
				...base,
				// mostramos label corto + motivo resumido en UI
				label: base.label,
			};
		}
		return base;
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
								<span className="font-medium">
									Volver al Dashboard
								</span>
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
								className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
							/>
						</div>

						{/* Filtro 1 */}
						<select
							value={actionFilter}
							onChange={(e) => setActionFilter(e.target.value)}
							className="cursor-pointer lg:w-[15%] w-full px-4 py-2.5 border focus:outline-none border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
						>
							<option value="todas">Todas las acciones</option>
							{Object.entries(tiposAccion).map(([key, value]) => (
								<option key={key} value={key}>
									{value.label}
								</option>
							))}
						</select>

						{/* Filtro 2 */}
						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className="cursor-pointer lg:w-[15%] w-full px-4 py-2.5 border focus:outline-none border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
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
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Usuario Afectado
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Administrador
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Acción
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Fecha y Hora
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Acciones
									</th>
								</tr>
							</thead>

							<tbody className="bg-white divide-y divide-gray-200">
								{/* Loading skeleton */}
								{isLoading && (
									<>
										{Array.from({ length: 6 }).map(
											(_, i) => (
												<tr
													key={`skeleton-${i}`}
													className="animate-pulse"
												>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="h-4 w-4 bg-gray-200 rounded" />
													</td>
													<td className="px-6 py-4">
														<div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
														<div className="h-3 bg-gray-100 rounded w-28"></div>
													</td>
													<td className="px-6 py-4">
														<div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
														<div className="h-3 bg-gray-100 rounded w-28"></div>
													</td>
													<td className="px-6 py-4">
														<div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
														<div className="h-3 bg-gray-100 rounded w-40"></div>
													</td>
													<td className="px-6 py-4">
														<div className="h-4 bg-gray-200 rounded w-36"></div>
													</td>
													<td className="px-6 py-4">
														<div className="h-8 w-8 bg-gray-200 rounded" />
													</td>
												</tr>
											)
										)}
									</>
								)}

								{/* No results */}
								{!isLoading && filteredData.length === 0 && (
									<tr>
										<td
											colSpan={6}
											className="px-6 py-12 text-center"
										>
											<div className="flex flex-col items-center justify-center gap-3">
												<FileText className="h-8 w-8 text-gray-300" />
												<div className="text-gray-500">
													No hay acciones en el
													historial aún.
												</div>
												<div className="text-xs text-gray-400">
													Cuando los administradores
													realicen cambios, aparecerán
													aquí.
												</div>
											</div>
										</td>
									</tr>
								)}

								{/* Data rows */}
								{!isLoading &&
									filteredData.map((entry) => {
										const actionConfig = getActionConfig(
											entry.accion
										);
										return (
											<tr
												key={entry.id}
												className="hover:bg-gray-50 transition-colors"
											>
												<td className="px-6 py-4 whitespace-nowrap"></td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
															<User className="h-4 w-4 text-blue-600" />
														</div>
														<div>
															<div className="text-sm font-medium text-gray-900">
																{
																	entry.nombre_afectado
																}
															</div>
															<div className="text-sm text-gray-500">
																DNI:{" "}
																{
																	entry.dni_afectado
																}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
															<Shield className="h-4 w-4 text-purple-600" />
														</div>
														<div>
															<div className="text-sm font-medium text-gray-900">
																{
																	entry.nombre_administrador
																}
															</div>
															<div className="text-sm text-gray-500">
																DNI:{" "}
																{
																	entry.dni_administrador
																}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div
															className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
																actionConfig.color ===
																"green"
																	? "bg-green-100"
																	: actionConfig.color ===
																	  "blue"
																	? "bg-blue-100"
																	: actionConfig.color ===
																	  "yellow"
																	? "bg-yellow-100"
																	: actionConfig.color ===
																	  "red"
																	? "bg-red-100"
																	: "bg-gray-100"
															}`}
														>
															<actionConfig.icon
																className={`h-4 w-4 ${
																	actionConfig.color ===
																	"green"
																		? "text-green-600"
																		: actionConfig.color ===
																		  "blue"
																		? "text-blue-600"
																		: actionConfig.color ===
																		  "yellow"
																		? "text-yellow-600"
																		: actionConfig.color ===
																		  "red"
																		? "text-red-600"
																		: "text-gray-600"
																}`}
															/>
														</div>
														<div>
															<div className="text-sm font-medium text-gray-900">
																{
																	actionConfig.label
																}
															</div>
															{entry.motivo && (
																<p className="text-xs text-gray-500 mt-1 max-w-xs truncate italic">
																	{
																		entry.motivo
																	}
																</p>
															)}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<Clock className="h-4 w-4 text-gray-400 mr-2" />
														<div className="text-sm text-gray-900">
															{formatDate(
																entry.created_at ||
																	entry.fecha
															)}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex items-center space-x-2">
														<button
															onClick={() =>
																setShowDetails(
																	entry
																)
															}
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
						<div className="flex-1 flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-700">
									{pager.total === 0 ? (
										<>
											Mostrando{" "}
											<span className="font-medium">
												0
											</span>{" "}
											de{" "}
											<span className="font-medium">
												0
											</span>{" "}
											resultados
										</>
									) : (
										<>
											Mostrando{" "}
											<span className="font-medium">
												{(pager.currentPage - 1) *
													(pager.perPage ||
														filteredData.length) +
													1}
											</span>{" "}
											a{" "}
											<span className="font-medium">
												{(pager.currentPage - 1) *
													(pager.perPage ||
														filteredData.length) +
													filteredData.length}
											</span>{" "}
											de{" "}
											<span className="font-medium">
												{pager.total}
											</span>{" "}
											resultados
										</>
									)}
								</p>
							</div>
							<div>
								<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
									<button
										className="relative inline-flex items-center px-2 py-2 rounded-l-md border disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
										onClick={() =>
											setPager((prev) => ({
												...prev,
												currentPage: Math.max(
													prev.currentPage - 1,
													1
												),
											}))
										}
										disabled={pager.currentPage === 1}
									>
										Anterior
									</button>
									<button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
										{`${pager.currentPage} de ${pager.totalPages}`}
									</button>
									<button
										className="relative inline-flex items-center px-2 py-2 rounded-r-md border disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
										onClick={() =>
											setPager((prev) => ({
												...prev,
												currentPage: Math.min(
													prev.currentPage + 1,
													prev.totalPages
												),
											}))
										}
										disabled={
											pager.currentPage ===
											pager.totalPages
										}
									>
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
