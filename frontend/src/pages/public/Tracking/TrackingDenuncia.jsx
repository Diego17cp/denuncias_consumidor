import React, { useState } from "react";

const TrackingDenuncia = () => {
    const [codigo, setCodigo] = useState("");
    const [estado, setEstado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados posibles con sus colores y descripciones
    const estadosDenuncia = {
        "registrada": {
            label: "Registrada",
            color: "bg-blue-100 text-blue-800",
            icon: "📝",
            descripcion: "Hemos recibido tu denuncia y está siendo revisada por nuestro equipo."
        },
        "en_proceso": {
            label: "En proceso",
            color: "bg-yellow-100 text-yellow-800",
            icon: "🔍",
            descripcion: "Tu denuncia está siendo investigada activamente por nuestros especialistas."
        },
        "resuelta": {
            label: "Resuelta",
            color: "bg-green-100 text-green-800",
            icon: "✅",
            descripcion: "Tu denuncia ha sido procesada y se han tomado las acciones correspondientes."
        },
        "rechazada": {
            label: "Rechazada",
            color: "bg-red-100 text-red-800",
            icon: "❌",
            descripcion: "Lamentablemente tu denuncia no cumplió con los requisitos necesarios."
        },
        "archivada": {
            label: "Archivada",
            color: "bg-gray-100 text-gray-800",
            icon: "🗄️",
            descripcion: "Tu denuncia ha sido archivada después de completar el proceso."
        }
    };

    const handleConsultar = () => {
        if (codigo.trim() === "") {
            setError("Por favor, ingrese un código válido.");
            setEstado(null);
            return;
        }

        setLoading(true);
        setError(null);

        // Simulación de llamada a API
        setTimeout(() => {
            try {
                // En una implementación real, aquí iría la llamada al backend
                // Por ahora simulamos una respuesta aleatoria
                const estadosPosibles = Object.keys(estadosDenuncia);
                const estadoAleatorio = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];

                setEstado(estadoAleatorio);
                setLoading(false);
            } catch (err) {
                setError("Ocurrió un error al consultar el estado. Por favor intente más tarde.");
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
                        <span className="text-blue-600 text-xl">🔍</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Seguimiento de Denuncia
                    </h1>
                    <p className="text-gray-600">
                        Ingrese el código de seguimiento para conocer el estado de su denuncia.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                            Código de seguimiento
                        </label>
                        <input
                            id="codigo"
                            type="text"
                            placeholder="Ej: DN-1234-ABCD"
                            value={codigo}
                            onChange={(e) => {
                                setCodigo(e.target.value);
                                setError(null);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleConsultar}
                        disabled={loading}
                        className={`cursor-pointer w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className=" opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Consultando...
                            </>
                        ) : (
                            "Consultar estado"
                        )}
                    </button>
                </div>

                {estado && (
                    <div className="mt-8 p-5 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Estado de tu denuncia
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadosDenuncia[estado].color}`}>
                                {estadosDenuncia[estado].label}
                            </span>
                        </div>

                        <div className="flex items-start space-x-3">
                            <span className="text-2xl mt-1">{estadosDenuncia[estado].icon}</span>
                            <p className="text-gray-700">
                                {estadosDenuncia[estado].descripcion}
                            </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                <strong>Código:</strong> {codigo}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Última actualización:</strong> {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-gray-500">
                    ¿Problemas con tu código? <a href="#" className="text-blue-600 hover:underline">Contáctanos</a>
                </div>
            </div>
        </div>
    );
};

export default TrackingDenuncia;