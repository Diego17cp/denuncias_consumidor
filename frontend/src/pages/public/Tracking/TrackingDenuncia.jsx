import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiClock, FiCheckCircle, FiAlertCircle, FiArchive, FiFileText, FiHelpCircle } from "react-icons/fi";

const TrackingDenuncia = () => {
    const [codigo, setCodigo] = useState("");
    const [estado, setEstado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Estados posibles con sus colores y descripciones
    const estadosDenuncia = {
        "registrada": {
            label: "Registrada",
            color: "bg-blue-100 text-blue-800",
            darkColor: "bg-blue-600 text-white",
            icon: <FiFileText className="text-lg" />,
            descripcion: "Hemos recibido tu denuncia y está siendo revisada por nuestro equipo."
        },
        "en_proceso": {
            label: "En proceso",
            color: "bg-yellow-100 text-yellow-800",
            darkColor: "bg-yellow-600 text-white",
            icon: <FiClock className="text-lg" />,
            descripcion: "Tu denuncia está siendo investigada activamente por nuestros especialistas."
        },
        "resuelta": {
            label: "Resuelta",
            color: "bg-green-100 text-green-800",
            darkColor: "bg-green-600 text-white",
            icon: <FiCheckCircle className="text-lg" />,
            descripcion: "Tu denuncia ha sido procesada y se han tomado las acciones correspondientes."
        },
        "rechazada": {
            label: "Rechazada",
            color: "bg-red-100 text-red-800",
            darkColor: "bg-red-600 text-white",
            icon: <FiAlertCircle className="text-lg" />,
            descripcion: "Lamentablemente tu denuncia no cumplió con los requisitos necesarios."
        },
        "archivada": {
            label: "Archivada",
            color: "bg-gray-100 text-gray-800",
            darkColor: "bg-gray-600 text-white",
            icon: <FiArchive className="text-lg" />,
            descripcion: "Tu denuncia ha sido archivada después de completar el proceso."
        }
    };

    // Obtener timeline según el estado actual
    const getTimeline = (currentState) => {
        const allStates = ["registrada", "en_proceso", "resuelta", "archivada"];
        const currentIndex = allStates.indexOf(currentState);
        
        return allStates.map((state, index) => ({
            estado: state,
            fecha: index === 0 ? "04 de junio de 2023, 10:28 a.m." : 
                index === 1 ? "17 de junio de 2023, 09:00 p.m." : 
                index === 2 ? "25 de junio de 2023, 03:45 p.m." : 
                "Pendiente",
            isActive: index <= currentIndex,
            isCompleted: index < currentIndex
        }));
    };

    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        if (estado) {
            setTimeline(getTimeline(estado));
        }
    }, [estado]);

    const handleConsultar = () => {
        if (codigo.trim() === "") {
            setError("Por favor, ingrese un código válido.");
            setEstado(null);
            return;
        }

        setLoading(true);
        setError(null);
        setIsSubmitted(true);

        // Simulación de llamada a API
        setTimeout(() => {
            try {
                const estadosPosibles = Object.keys(estadosDenuncia);
                const estadoAleatorio = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];
                setEstado(estadoAleatorio);
            } catch (err) {
                setError("Ocurrió un error al consultar el estado. Por favor intente más tarde.");
            } finally {
                setLoading(false);
            }
        }, 1500);
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
                        Ingresa tu código de seguimiento para conocer el estado actual
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
                                className="w-full px-5 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
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
                                    <svg className="cursor-pointer animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Buscando...
                                </>
                            ) : "Buscar"}
                        </button>
                    </motion.div>
                    
                    <AnimatePresence>
                        {error && (
                            <motion.p 
                                className="mt-2 text-red-500 text-sm"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Contenido principal */}
                <AnimatePresence>
                    {loading && <Loader />}
                </AnimatePresence>

                <AnimatePresence>
                    {isSubmitted && !loading && estado && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
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
                                <div className={`p-3 rounded-lg ${estadosDenuncia[estado].darkColor} shadow-sm`}>
                                    {estadosDenuncia[estado].icon}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-800">Denuncia #{codigo || 'TD61F7DB0AF0F6BDC1A6'}</h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 text-sm rounded-full ${estadosDenuncia[estado].color} font-medium`}>
                                            {estadosDenuncia[estado].label}
                                        </span>
                                        <span className="text-sm text-gray-500">Actualizado hoy</span>
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
                                <h3 className="text-lg font-semibold text-gray-700 mb-6 pl-2">Historial de estados</h3>
                                
                                <div className="space-y-6">
                                    {timeline.map((item, index) => (
                                        <motion.div 
                                            key={item.estado}
                                            className="flex gap-4 relative"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 + 0.3 }}
                                        >
                                            {/* Línea vertical */}
                                            {index !== timeline.length - 1 && (
                                                <div className={`absolute left-5 top-8 w-0.5 h-full ${
                                                    item.isCompleted ? "bg-blue-500" : "bg-gray-200"
                                                }`} />
                                            )}

                                            {/* Círculo indicador */}
                                            <div className={`relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                                item.isActive 
                                                    ? item.isCompleted
                                                        ? "border-blue-500 bg-blue-500 text-white"
                                                        : "border-blue-500 bg-white text-blue-500"
                                                    : "border-gray-200 bg-white text-gray-400"
                                            }`}>
                                                {estadosDenuncia[item.estado].icon}
                                            </div>

                                            {/* Contenido */}
                                            <div className="flex-1 pt-1">
                                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                                    <h3 className={`font-medium ${
                                                        item.isActive ? "text-gray-800" : "text-gray-500"
                                                    }`}>
                                                        {estadosDenuncia[item.estado].label}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        item.isActive ? estadosDenuncia[item.estado].color : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                        {item.isCompleted ? "Completado" : 
                                                        item.isActive ? "Activo" : "Pendiente"}
                                                    </span>
                                                </div>
                                                <p className={`text-sm ${item.isActive ? "text-gray-600" : "text-gray-400"}`}>
                                                    {estadosDenuncia[item.estado].descripcion}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <FiClock className="text-xs" /> {item.fecha}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
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
                                        <h4 className="font-medium text-blue-800">¿Necesitas ayuda?</h4>
                                        <p className="text-blue-600 mt-1">
                                            Si tienes dudas sobre el estado de tu denuncia, contacta a nuestro <a href="#" className="underline font-medium">equipo de soporte</a>.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
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
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Consulta tu denuncia</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                Ingresa el código de seguimiento que recibiste al registrar tu denuncia para ver su estado actual.
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