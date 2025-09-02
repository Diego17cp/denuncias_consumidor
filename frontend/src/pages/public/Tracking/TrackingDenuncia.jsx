import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	FiSearch,
	FiClock,
	FiCheckCircle,
	FiAlertCircle,
	FiArchive,
	FiFileText,
	FiHelpCircle,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import { useLocation, useSearchParams } from "react-router"

const TrackingDenuncia = () => {
	const API_URL = import.meta.env.VITE_CI_API_BASE_URL;

	const [codigo, setCodigo] = useState("");
	const [eventos, setEventos] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isJustRegistered, setIsJustRegistered] = useState(false);
	const [searchParams] = useSearchParams()
	const trackingCode = searchParams.get("codigo")

	useEffect(() => {
		if (trackingCode) {
			setCodigo(trackingCode)
		} else {
			setCodigo("")
		}
	}, [trackingCode])
	useEffect(() => {
        if (trackingCode && codigo && codigo === trackingCode) {
            handleConsultar()
        }
    }, [codigo, trackingCode])

	const estadosDenuncia = {
		registrada: {
			label: "Registrada",
			color: "bg-blue-100 text-blue-800",
			darkColor: "bg-blue-600 text-white",
			icon: <FiFileText className="text-lg" />,
			descripcion:
				"Hemos recibido tu denuncia y está siendo revisada por nuestro equipo.",
		},
		recibida: {
			label: "Recibida",
			color: "bg-blue-100 text-blue-800",
			darkColor: "bg-blue-600 text-white",
			icon: <FiFileText className="text-lg" />,
			descripcion:
				"La denuncia ha sido recibida por el sistema/administrador.",
		},
		recibido: {
			label: "Recibido",
			color: "bg-blue-100 text-blue-800",
			darkColor: "bg-blue-600 text-white",
			icon: <FiFileText className="text-lg" />,
			descripcion: "La denuncia ha sido registrada como recibida.",
		},
		en_proceso: {
			label: "En proceso",
			color: "bg-yellow-100 text-yellow-800",
			darkColor: "bg-yellow-600 text-white",
			icon: <FiClock className="text-lg" />,
			descripcion:
				"Tu denuncia está siendo investigada activamente por nuestros especialistas.",
		},
		aceptado: {
			label: "Aceptado",
			color: "bg-green-100 text-green-800",
			darkColor: "bg-green-600 text-white",
			icon: <FiCheckCircle className="text-lg" />,
			descripcion:
				"La denuncia ha sido aceptada y se procederá con las acciones correspondientes.",
		},
		finalizada: {
			label: "Finalizada",
			color: "bg-green-100 text-green-800",
			darkColor: "bg-green-600 text-white",
			icon: <FiCheckCircle className="text-lg" />,
			descripcion:
				"Tu denuncia ha sido procesada y se han tomado las acciones correspondientes.",
		},
		rechazada: {
			label: "Rechazada",
			color: "bg-red-100 text-red-800",
			darkColor: "bg-red-600 text-white",
			icon: <FiAlertCircle className="text-lg" />,
			descripcion:
				"Lamentablemente tu denuncia no cumplió con los requisitos necesarios.",
		},
		archivada: {
			label: "Archivada",
			color: "bg-gray-100 text-gray-800",
			darkColor: "bg-gray-600 text-white",
			icon: <FiArchive className="text-lg" />,
			descripcion:
				"Tu denuncia ha sido archivada después de completar el proceso.",
		},
	};
	const formatDate = (dateString) => {
		if (!dateString) return "Pendiente";
		const d = new Date(dateString.replace(" ", "T"));
		try {
			return d.toLocaleString("es-PE", {
				day: "2-digit",
				month: "long",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateString;
		}
	};
	const buildTimelineFromEvents = (eventsArray) => {
		if (!Array.isArray(eventsArray) || eventsArray.length === 0) return [];

		// ordenar asc por created_at
		const sorted = [...eventsArray].sort(
			(a, b) => new Date(a.created_at) - new Date(b.created_at)
		);

		// reducir a estados únicos en orden (si quieren mostrar repetidos, quitar este step)
		const uniqueByEstado = sorted.reduce((acc, ev) => {
			if (!acc.find((x) => x.estado === ev.estado)) acc.push(ev);
			return acc;
		}, []);

		return uniqueByEstado.map((ev, idx) => ({
			estado: ev.estado,
			fecha: formatDate(ev.created_at),
			isActive: idx === uniqueByEstado.length - 1,
			isCompleted: idx < uniqueByEstado.length - 1,
			comentario: ev.comentario,
		}));
	};

	const [timeline, setTimeline] = useState([]);

	useEffect(() => {
		if (eventos) {
			setTimeline(buildTimelineFromEvents(eventos));
		} else {
			setTimeline([]);
		}
	}, [eventos]);

	const handleConsultar = async () => {
		if (codigo.trim() === "") {
			setError("Por favor, ingrese un código válido.");
			setEventos(null);
			setIsSubmitted(true);
			return;
		}

		setLoading(true);
		setError(null);
		setIsSubmitted(true);

		try {
			const response = await axios.get(
				`${API_URL}/denuncias/codigo/${codigo}`
			);
			if (
				response.data &&
				response.data.success &&
				Array.isArray(response.data.data) &&
				response.data.data.length > 0
			) {
				setEventos(response.data.data);
				setIsJustRegistered(false);
			} else if (response.data && response.data.success && response.data.data.length === 0) {
				setEventos([]);
				setIsJustRegistered(true);
			}
			else {
				setEventos([]);
				setIsJustRegistered(false);
				toast.error("No se encontró la denuncia con ese código.");
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(
					"Error al consultar la denuncia. Inténtalo de nuevo."
				);
				console.error(
					"Error en la solicitud:",
					err.response || err.message
				);
			} else {
				console.error("Error inesperado:", err);
			}
		} finally {
			setLoading(false);
		}
	};

	// Componente de carga optimizado
	const Loader = () => (
		<motion.div
			className="flex justify-center py-8"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<div className="flex space-x-2">
				{[0, 0.2, 0.4].map((delay) => (
					<motion.div
						key={delay}
						className="w-3 h-3 bg-blue-600 rounded-full"
						animate={{ y: [0, -8, 0] }}
						transition={{ duration: 1.2, repeat: Infinity, delay }}
					/>
				))}
			</div>
		</motion.div>
	);

	// helper para obtener meta del estado (fallback si no existe mapping)
	const getEstadoMeta = (key) => {
		if (!key)
			return {
				label: "Desconocido",
				color: "bg-gray-100 text-gray-800",
				darkColor: "bg-gray-600 text-white",
				icon: <FiFileText className="text-lg" />,
				descripcion: "",
			};
		return (
			estadosDenuncia[key] || {
				label:
					key.charAt(0).toUpperCase() +
					key.slice(1).replace(/_/g, " "),
				color: "bg-gray-100 text-gray-800",
				darkColor: "bg-gray-600 text-white",
				icon: <FiFileText className="text-lg" />,
				descripcion: "",
			}
		);
	};

	// estado actual (último en el timeline)
	const currentEstadoKey = timeline.length
		? timeline[timeline.length - 1].estado
		: null;
	const currentEstadoMeta = getEstadoMeta(currentEstadoKey);

	return (
		<div className="min-h-screen  p-8 mt-6 md:p-8">
			<div className="max-w-3xl mx-auto">
				{/* Barra de búsqueda */}
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<motion.h1
						className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						Seguimiento de Denuncia
					</motion.h1>

					<motion.p
						className="text-gray-600 mb-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						Ingresa tu código de seguimiento para conocer el estado
						actual
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row gap-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						<div className="relative flex-1">
							<input
								type="text"
								value={codigo}
								onChange={(e) => setCodigo(e.target.value)}
								placeholder="Ej: TD61F7DB0AF0F6BDC1A6"
								className="w-full px-5 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 ease-in-out shadow-sm"
							/>
							<FiSearch className="absolute right-4 top-3.5 text-gray-400" />
						</div>
						<button
							onClick={handleConsultar}
							disabled={loading}
							className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
						>
							{loading ? (
								<>
									<svg
										className="cursor-pointer animate-spin h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Buscando...
								</>
							) : (
								"Buscar"
							)}
						</button>
					</motion.div>

					<AnimatePresence>
						{error && (
							<motion.p
								className="mt-2 text-red-500 text-sm"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
							>
								{error}
							</motion.p>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Contenido principal */}
				<AnimatePresence>{loading && <Loader />}</AnimatePresence>

				<AnimatePresence>
					{isSubmitted &&
						!loading &&
						timeline &&
						timeline.length > 0 && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								transition={{ duration: 0.5 }}
								className="space-y-8"
							>
								{/* Encabezado del estado */}
								<motion.div
									className="flex items-start gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/60 shadow-sm"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									<div
										className={`p-3 rounded-lg ${currentEstadoMeta.darkColor} shadow-sm`}
									>
										{currentEstadoMeta.icon}
									</div>
									<div className="flex-1">
										<h2 className="text-xl font-bold text-gray-800">
											Denuncia #
											{codigo || "TD61F7DB0AF0F6BDC1A6"}
										</h2>
										<div className="flex flex-wrap items-center gap-2 mt-1">
											<span
												className={`px-3 py-1 text-sm rounded-full ${currentEstadoMeta.color} font-medium`}
											>
												{currentEstadoMeta.label}
											</span>
											<span className="text-sm text-gray-500">
												Actualizado{" "}
												{
													timeline[
														timeline.length - 1
													].fecha
												}
											</span>
										</div>
									</div>
								</motion.div>

								{/* Timeline */}
								<motion.div
									className="relative"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<h3 className="text-lg font-semibold text-gray-700 mb-6 pl-2">
										Historial de estados
									</h3>

									<div className="space-y-6">
										{timeline.map((item, index) => {
											const meta = getEstadoMeta(
												item.estado
											);
											return (
												<motion.div
													key={item.estado + index}
													className="flex gap-4 relative"
													initial={{
														opacity: 0,
														x: -10,
													}}
													animate={{
														opacity: 1,
														x: 0,
													}}
													transition={{
														delay:
															index * 0.1 + 0.3,
													}}
												>
													{/* Línea vertical */}
													{index !==
														timeline.length - 1 && (
														<div
															className={`absolute left-5 top-8 w-0.5 h-full ${
																item.isCompleted
																	? "bg-blue-500"
																	: "bg-gray-200"
															}`}
														/>
													)}

													{/* Círculo indicador */}
													<div
														className={`relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
															item.isActive
																? item.isCompleted
																	? "border-blue-500 bg-blue-500 text-white"
																	: "border-blue-500 bg-white text-blue-500"
																: "border-gray-200 bg-white text-gray-400"
														}`}
													>
														{meta.icon}
													</div>

													{/* Contenido */}
													<div className="flex-1 pt-1">
														<div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
															<h3
																className={`font-medium ${
																	item.isActive
																		? "text-gray-800"
																		: "text-gray-500"
																}`}
															>
																{meta.label}
															</h3>
															<span
																className={`text-xs px-2 py-1 rounded-full ${
																	item.isActive
																		? meta.color
																		: "bg-gray-100 text-gray-500"
																}`}
															>
																{item.isCompleted
																	? "Completado"
																	: item.isActive
																	? "Activo"
																	: "Pendiente"}
															</span>
														</div>
														<p
															className={`text-sm ${
																item.isActive
																	? "text-gray-600"
																	: "text-gray-400"
															}`}
														>
															{item.comentario}
														</p>
														<p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
															<FiClock className="text-xs" />{" "}
															{item.fecha}
														</p>
													</div>
												</motion.div>
											);
										})}
									</div>
								</motion.div>

								{/* Nota adicional */}
								<motion.div
									className="p-4 bg-blue-50/50 rounded-lg border border-blue-200 text-sm"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.8 }}
								>
									<div className="flex gap-3">
										<div className="text-blue-500 mt-0.5">
											<FiHelpCircle className="text-lg" />
										</div>
										<div>
											<h4 className="font-medium text-blue-800">
												¿Necesitas ayuda?
											</h4>
											<p className="text-blue-600 mt-1">
												Si tienes dudas sobre el estado
												de tu denuncia, contacta a
												nuestro{" "}
												<a
													href="#"
													className="underline font-medium"
												>
													equipo de soporte
												</a>
												.
											</p>
										</div>
									</div>
								</motion.div>
							</motion.div>
						)}
				</AnimatePresence>

				{/* Special "only registered" message */}
				<AnimatePresence>
					{isSubmitted && !loading && isJustRegistered && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.4 }}
							className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm"
						>
							<div className="flex items-start gap-4">
								<div className="text-yellow-600 mt-1">
									<FiAlertCircle className="text-2xl" />
								</div>
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-yellow-800">
										Denuncia registrada
									</h3>
									<p className="text-sm text-yellow-700 mt-1">
										Hemos recibido tu denuncia correctamente, pero aún no se ha asignado
										seguimiento por parte de un administrador. En cuanto se realice una
										acción, podrás ver el historial aquí.
									</p>
									<div className="mt-4 flex flex-wrap gap-3">
										<button
											onClick={() => (window.location.href = "/")}
											className="px-4 py-2 bg-white rounded-lg text-sm shadow-sm transition-all duration-200 hover:shadow-md border border-gray-200 ease-in-out cursor-pointer"
										>
											Volver al inicio
										</button>
										<button
											// onClick={() => window.open('mailto:soporte@tusitio.local')}
											className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm shadow-sm transition-all duration-200 hover:shadow-md  ease-in-out cursor-pointer"
										>
											Contactar soporte
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Estado inicial */}
				<AnimatePresence>
					{!isSubmitted && !loading && (
						<motion.div
							className="text-center py-12"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
								<FiFileText className="text-2xl text-blue-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								Consulta tu denuncia
							</h3>
							<p className="text-gray-600 max-w-md mx-auto mb-6">
								Ingresa el código de seguimiento que recibiste
								al registrar tu denuncia para ver su estado
								actual.
							</p>
							<motion.div
								className="flex justify-center"
								animate={{ opacity: [0.6, 1, 0.6] }}
								transition={{ duration: 2, repeat: Infinity }}
							>
								<div className="w-24 h-1 bg-gray-300 rounded-full" />
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default TrackingDenuncia;
