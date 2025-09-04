import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useDenunciasGestion() {
	const API_URL = import.meta.env.VITE_CI_API_BASE_URL;

	const [activeTab, setActiveTab] = useState("disponibles");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("todos");
	const [selectedDenuncia, setSelectedDenuncia] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [newStatus, setNewStatus] = useState("");
	const [searchType, setSearchType] = useState("DNI");
	const [searchDocument, setSearchDocument] = useState("");
	const [searchName, setSearchName] = useState("");
	const [searchDenunciante, setSearchDenunciante] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchResultsDisponibles, setSearchResultsDisponibles] = useState([]);
	const [searchResultsRecibidas, setSearchResultsRecibidas] = useState([]);
	const [expandedFilters, setExpandedFilters] = useState(false);
	const [pager, setPager] = useState({
		registradas: {
			currentPage: 1,
			totalPages: 1,
		},
		recibidas: {
			currentPage: 1,
			totalPages: 1,
		},
	});
	const [stats, setStats] = useState({
		total: 0,
		pending: 0,
		in_process: 0,
		closed: 0,
		recieved: 0,
	});
	const [isRecieving, setRecieving] = useState(new Map());
	const handlePageChange = (type, page) => {
		setPager((prev) => ({
			...prev,
			[type]: {
				...prev[type],
				currentPage: page,
			},
		}));
	};
	const [registeredDenuncias, setRegisteredDenuncias] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const fetchRegisteredDenuncias = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`${API_URL}/admin/registradas?page=${pager.registradas.currentPage}`,
				{
					withCredentials: true,
				}
			);
			if (response.data.success || response.status === 200) {
				const data = response.data.data;
				const pagination = response.data.pager;
				setRegisteredDenuncias(data);
				setPager((prev) => ({
					...prev,
					registradas: {
						currentPage: pagination.currentPage,
						totalPages: pagination.pageCount,
					},
				}));
			} else {
				setRegisteredDenuncias([]);
				toast.error(response.data.messages.message);
			}
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.response?.status === 400) {
					setRegisteredDenuncias([]);
					setPager((prev) => ({
						...prev,
						registradas: {
							currentPage: 1,
							totalPages: 1,
						},
					}));
				} else {
					console.error(
						e.response?.data?.error ||
							"Error al obtener las denuncias registradas."
					);
				}
			}
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [API_URL, pager.registradas.currentPage]);
	const [recievedDenuncias, setRecievedDenuncias] = useState([]);
	const fetchRecievedDenuncias = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`${API_URL}/admin/activas?page=${pager.recibidas.currentPage}`,
				{
					withCredentials: true,
				}
			);
			if (response.data.success || response.status === 200) {
				const data = response.data.data;
				const pagination = response.data.pager;
				setRecievedDenuncias(data);
				setPager((prev) => ({
					...prev,
					recibidas: {
						currentPage: pagination.currentPage,
						totalPages: pagination.pageCount,
					},
				}));
			} else {
				setRecievedDenuncias([]);
			}
		} catch (e) {
			if (axios.isAxiosError(e)) {
				console.error(
					e.response?.data?.error ||
						"Error al obtener las denuncias recibidas."
				);
			}
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [API_URL, pager.recibidas.currentPage]);
	const startReceiving = (key) => {
		setRecieving((prev) => {
			const m = new Map(prev);
			m.set(key, true);
			return m;
		});
	};
	const stopReceiving = (key) => {
		setRecieving((prev) => {
			const m = new Map(prev);
			m.delete(key);
			return m;
		});
	};
	const recieveDenuncia = useCallback(
		async (trackingCode) => {
			startReceiving(trackingCode);
			try {
				const response = await axios.post(
					`${API_URL}/admin/recibir`,
					{
						tracking_code: trackingCode,
					},
					{
						withCredentials: true,
					}
				);
				if (response.data.success || response.status === 200) {
					toast.success("Denuncia recibida exitosamente");
					await getStatistics();
					await fetchRegisteredDenuncias();
				} else {
					toast.error("Error al recibir la denuncia.");
				}
			} catch (e) {
				if (axios.isAxiosError(e)) {
					console.error(
						e.response?.data?.error ||
							"Error al recibir la denuncia."
					);
				}
				console.error(e);
			} finally {
				stopReceiving(trackingCode);
			}
		},
		[API_URL, fetchRegisteredDenuncias]
	);
	const [denunciasRecibidas, setDenunciasRecibidas] = useState([
		{
			id: "DEN-2025-001",
			motivo: "Agresión verbal y amenazas",
			contra: "Pedro Torres",
			fecha: "2025-08-15",
			estado: "Pendiente",
			denunciante: "Carmen López",
			denuncianteDni: "12345678",
			denunciadoDni: "87654321",
			detalleIncidente:
				"El denunciado profirió insultos y amenazas durante una reunión de trabajo",
			fechaIncidente: "2025-08-14",
			lugarIncidente: "Sala de reuniones - Piso 3",
			historial: [
				{
					fecha: "2025-08-15 09:00",
					estado: "Registrada",
					comentario: "Denuncia recibida y registrada en el sistema",
				},
			],
			comentarios:
				"Se ha iniciado la investigación preliminar. Pendiente entrevista con testigos.",
			evidencias: ["audio_reunion.mp3", "testimonio_testigo1.pdf"],
		},
		{
			id: "DEN-2025-002",
			motivo: "Discriminación por edad",
			contra: "Sandra Ruiz",
			fecha: "2025-08-12",
			estado: "Pendiente",
			denunciante: "Miguel Vargas",
			denuncianteDni: "11223344",
			denunciadoDni: "44332211",
			detalleIncidente:
				"Comentarios discriminatorios sobre la edad del denunciante",
			fechaIncidente: "2025-08-10",
			lugarIncidente: "Departamento de Recursos Humanos",
			historial: [
				{
					fecha: "2025-08-12 10:15",
					estado: "Registrada",
					comentario: "Denuncia recibida",
				},
				{
					fecha: "2025-08-12 16:45",
					estado: "Pendiente",
					comentario: "En espera de asignación de investigador",
				},
			],
			comentarios:
				"Pendiente de asignación a investigador especializado.",
			evidencias: ["email_discriminatorio.pdf"],
		},
	]);

	const estados = [
		{ value: "recibida", label: "Recibida", color: "blue" },
		{ value: "en_proceso", label: "En proceso", color: "amber" },
		{ value: "rechazada", label: "Rechazada", color: "red" },
		{ value: "aceptada", label: "Aceptada", color: "emerald" },
		{ value: "finalizada", label: "Finalizada", color: "slate" },
	];

	const filteredDenuncias = recievedDenuncias.filter((denuncia) => {
		const q = String(searchTerm || "")
			.trim()
			.toLowerCase();

		const nombreDenunciado = String(
			denuncia?.denunciado?.nombre || ""
		).toLowerCase();
		const nombreDenunciante = String(
			denuncia?.denunciante?.nombre || ""
		).toLowerCase();
		const tracking = String(denuncia?.tracking_code || "").toLowerCase();
		const descripcion = String(denuncia?.descripcion || "").toLowerCase();
		const dniDenunciado = String(denuncia?.denunciado?.dni || "");
		const dniDenunciante = String(denuncia?.denunciante?.dni || "");

		const matchesSearch =
			q === "" ||
			nombreDenunciado.includes(q) ||
			tracking.includes(q) ||
			descripcion.includes(q) ||
			nombreDenunciante.includes(q) ||
			dniDenunciado.includes(q) ||
			dniDenunciante.includes(q);

		const estadoNormalized = String(denuncia?.estado || "")
			.toLowerCase()
			.replace(/_/g, "")
			.replace(/\s+/g, "");
		const matchesStatus =
			statusFilter === "todos" ||
			estadoNormalized ===
				String(statusFilter || "")
					.toLowerCase()
					.replace(/_/g, "")
					.replace(/\s+/g, "");

		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status) => {
		const normalizedStatus = status.toLowerCase().replace(" ", "");
		const statusObj = estados.find(
			(s) =>
				s.value === normalizedStatus ||
				s.label.toLowerCase().replace(" ", "") === normalizedStatus
		);
		return statusObj ? statusObj.color : "slate";
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "alta":
				return "red";
			case "media":
				return "amber";
			case "baja":
				return "emerald";
			default:
				return "slate";
		}
	};

	const getStatusStyles = (status) => {
		const color = getStatusColor(status);
		const colorMap = {
			emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
			amber: "bg-amber-50 text-amber-700 border-amber-200",
			blue: "bg-blue-50 text-blue-700 border-blue-200",
			slate: "bg-slate-50 text-slate-700 border-slate-200",
			red: "bg-red-50 text-red-700 border-red-200",
		};
		return colorMap[color] || colorMap.slate;
	};

	const getPriorityStyles = (priority) => {
		const color = getPriorityColor(priority);
		const colorMap = {
			red: "bg-red-50 text-red-700 border-red-200",
			amber: "bg-amber-50 text-amber-700 border-amber-200",
			emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
			slate: "bg-slate-50 text-slate-700 border-slate-200",
		};
		return colorMap[color] || colorMap.slate;
	};

	const recibirDenuncia = (denuncia) => {
		const nuevaDenuncia = {
			id: `DEN-2025-${String(denunciasRecibidas.length + 1).padStart(
				3,
				"0"
			)}`,
			motivo: denuncia.descripcion,
			contra: denuncia.denunciado,
			fecha: new Date().toISOString().split("T")[0],
			estado: "Registrada",
			denunciante: denuncia.denunciante,
			denuncianteDni: "12345678",
			denunciadoDni: "87654321",
			detalleIncidente: denuncia.descripcion,
			fechaIncidente: denuncia.fecha,
			lugarIncidente: denuncia.lugar,
			historial: [
				{
					fecha: new Date().toLocaleString(),
					estado: "Registrada",
					comentario: "Denuncia recibida y registrada en el sistema",
				},
			],
			comentarios:
				"Denuncia recién recibida, pendiente de revisión inicial.",
			evidencias: [],
		};

		setDenunciasRecibidas([...denunciasRecibidas, nuevaDenuncia]);
		setDenunciasDisponibles(
			denunciasDisponibles.filter((d) => d.id !== denuncia.id)
		);
		alert("Denuncia recibida exitosamente");
	};

	const mostrarDetalles = (denuncia) => {
		setSelectedDenuncia(denuncia);
		setNewComment(denuncia.comentarios || "");
		setNewStatus(denuncia.estado);
		setShowDetails(true);
	};

	const actualizarDenuncia = () => {
		if (!selectedDenuncia) return;

		const nuevoHistorial = [...selectedDenuncia.historial];
		if (newStatus !== selectedDenuncia.estado) {
			nuevoHistorial.push({
				fecha: new Date().toLocaleString(),
				estado: newStatus,
				comentario: newComment,
			});
		}

		const denunciaActualizada = {
			...selectedDenuncia,
			estado: newStatus,
			comentarios: newComment,
			historial: nuevoHistorial,
		};

		setDenunciasRecibidas(
			denunciasRecibidas.map((d) =>
				d.id === selectedDenuncia.id ? denunciaActualizada : d
			)
		);
		setSelectedDenuncia(denunciaActualizada); // No cerrar el modal, solo actualizar
		alert("Denuncia actualizada exitosamente");
	};
	const [isSearching, setIsSearching] = useState(false);
	const buscarDenuncias = async () => {
		setIsSearching(true);
		let resultados = [];
		try {
			// Buscar por documento
			if (searchDocument.length > 0) {
				const response = await axios.get(
					`${API_URL}/admin/documento/${searchDocument}`,
					{ withCredentials: true }
				);
				if (response.data.success || response.status === 200) {
					resultados = response.data.data;
				}
			}
			// Buscar por nombre del denunciado
			if (searchName.length > 0) {
				const response = await axios.get(
					`${API_URL}/admin/nombre-1/${searchName}`,
					{ withCredentials: true }
				);
				if (response.data.success || response.status === 200) {
					resultados = resultados.concat(response.data.data);
				}
			}
			// Buscar por nombre del denunciante
			if (searchDenunciante.length > 0) {
				const response = await axios.get(
					`${API_URL}/admin/nombre-2/${searchDenunciante}`,
					{ withCredentials: true }
				);
				if (response.data.success || response.status === 200) {
					resultados = resultados.concat(response.data.data);
				}
			}
			const recibidas = resultados.filter(
				(d) =>
					d.estado &&
					!["registrado"].includes(
						String(d.estado).toLowerCase()
					)
			);
			const uniqueResults = recibidas.filter(
				(v, i, a) => a.findIndex(t => t.id === v.id) === i
			);
			setSearchResults(uniqueResults);
			if (uniqueResults.length === 0) {
				toast.error("No se encontraron denuncias con esos criterios.");
			}
		} catch (error) {
			console.error("Error al buscar denuncias:", error);
			setSearchResults([]);
			toast.error("Ocurrió un error al buscar denuncias.");
		} finally {
			setIsSearching(false);
		}
	};

	const limpiarBusqueda = () => {
		setSearchDocument("");
		setSearchName("");
		setSearchDenunciante("");
		setSearchResults([]);
	};
	const limpiarBusquedaDisponibles = () => setSearchResultsDisponibles([]);
	const limpiarBusquedaRecibidas = () => setSearchResultsRecibidas([]);

	async function getStatistics() {
		try {
			const response = await axios.get(`${API_URL}/denuncias/stats`, {
				withCredentials: true,
			});
			if (response.data.success) {
				setStats(response.data.data);
			} else {
				setStats({
					total: 0,
					pending: 0,
					in_process: 0,
					closed: 0,
				});
			}
		} catch (error) {
			console.error("Error al obtener estadísticas:", error);
			setStats({
				total: 0,
				pending: 0,
				in_process: 0,
				closed: 0,
			});
		}
	}

	const buscarDenunciasPorNombre = async (nombre, tab) => {
		setIsSearching(true);
		try {
			const response = await axios.get(
				`${API_URL}/admin/nombre-1/${nombre}`,
				{ withCredentials: true }
			);
			if (response.data.success || response.status === 200) {
				let resultados = response.data.data;
				if (tab === "disponibles") {
					resultados = resultados.filter(
						(d) =>
							d.estado &&
							String(d.estado).toLowerCase() === "registrado"
					);
					setSearchResultsDisponibles(resultados);
				} else if (tab === "recibidos") {
					resultados = resultados.filter(
						(d) =>
							d.estado &&
							String(d.estado).toLowerCase() !== "registrado"
					);
					setSearchResultsRecibidas(resultados);
				}
			} else {
				if (tab === "disponibles") setSearchResultsDisponibles([]);
				else if (tab === "recibidos") setSearchResultsRecibidas([]);
				toast.error("No se encontraron denuncias con ese nombre.");
			}
		} catch (error) {
			if (tab === "disponibles") setSearchResultsDisponibles([]);
			else if (tab === "recibidos") setSearchResultsRecibidas([]);
			toast.error("Ocurrió un error al buscar denuncias.");
		} finally {
			setIsSearching(false);
		}
	};

	return {
		// Estados
		activeTab,
		setActiveTab,
		searchTerm,
		setSearchTerm,
		statusFilter,
		setStatusFilter,
		selectedDenuncia,
		setSelectedDenuncia,
		showDetails,
		setShowDetails,
		newComment,
		setNewComment,
		newStatus,
		setNewStatus,
		searchType,
		setSearchType,
		searchDocument,
		setSearchDocument,
		searchName,
		setSearchName,
		searchDenunciante,
		setSearchDenunciante,
		searchResults,
		setSearchResults,
		searchResultsDisponibles,
		searchResultsRecibidas,
		expandedFilters,
		setExpandedFilters,
		registeredDenuncias,
		fetchRegisteredDenuncias,
		denunciasRecibidas,
		setDenunciasRecibidas,
		estados,
		filteredDenuncias,
		recievedDenuncias,
		fetchRecievedDenuncias,
		isSearching,
		pager,
		isLoading,
		isRecieving,
		// Funciones
		getStatusStyles,
		getPriorityStyles,
		recibirDenuncia,
		recieveDenuncia,
		mostrarDetalles,
		actualizarDenuncia,
		buscarDenuncias,
		limpiarBusqueda,
		limpiarBusquedaDisponibles,
		limpiarBusquedaRecibidas,
		stats,
		handlePageChange,
		getStatistics,
		startReceiving,
		stopReceiving,
		buscarDenunciasPorNombre,
	};
}
