import React from "react";
import {
    X,
    User,
    Shield,
    FileBox,
    Clock,
    MessageSquare,
    Download,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Mapeo de colores por estado
const estadoColors = {
    Registrada: "bg-green-50 border-green-400 text-green-700",
    Pendiente: "bg-amber-50 border-amber-400 text-amber-700",
    Cerrada: "bg-slate-50 border-slate-400 text-slate-700",
    Archivada: "bg-red-50 border-red-400 text-red-700",
};

export default function ModalDetalleDenuncia({
    open,
    denuncia,
    newComment,
    setNewComment,
    newStatus,
    setNewStatus,
    onClose,
}) {

    const API_URL = import.meta.env.VITE_CI_API_BASE_URL

    const onUpdate = async () => {
        const data = {
            tracking_code: denuncia.tracking_code,
            comentario: newComment,
            estado: newStatus
        }
        try {
            const response = await axios.post(`${API_URL}/admin/procesos-denuncia`, data, {
                withCredentials: true
            })
            if (response.data.success || response.status === 200) {
                toast.success("Denuncia actualizada correctamente.");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error("Error al actualizar la denuncia. Inténtalo de nuevo.");
                console.error("Error en la solicitud:", err.response || err.message);
            }
            console.error("Error inesperado:", err);
            toast.error("Error al actualizar la denuncia. Inténtalo de nuevo.");
        }
    }

    if (!open || !denuncia) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Fondo blur detrás del modal */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Contenido del modal */}
            <div className="relative z-10 w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Detalles de la Denuncia
                        </h3>
                        <p className="text-blue-600 font-semibold text-base mt-1">
                            {denuncia.tracking_code}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido principal */}
                <div className="p-6 flex flex-col gap-6">
                    {/* Info principal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Denunciante */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-blue-700">Denunciante</span>
                            </div>
                            <div className="text-slate-900 font-medium">
                                {denuncia.denunciante.nombre}
                            </div>
                            <div className="text-slate-600 text-sm">
                                Documento: {denuncia.denunciante.documento}
                            </div>
                        </div>
                        {/* Denunciado */}
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-red-600" />
                                <span className="font-semibold text-red-700">Denunciado</span>
                            </div>
                            <div className="text-slate-900 font-medium">{denuncia.denunciado.nombre}</div>
                            <div className="text-slate-600 text-sm">
                                Documento: {denuncia.denunciado.documento}
                            </div>
                        </div>
                    </div>

                    {/* Detalles del incidente */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <FileBox className="h-5 w-5 text-slate-600" />
                            <span className="font-semibold text-slate-700">
                                Detalles del Incidente
                            </span>
                        </div>
                        <div className="text-slate-900 mb-2">
                            <span className="font-semibold">Motivo:</span>{" "}
                            {denuncia.descripcion}
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 text-slate-700 text-sm">
                            <div>
                                <span className="font-semibold">Fecha:</span>{" "}
                                {denuncia.fecha_incidente}
                            </div>
                            <div>
                                <span className="font-semibold">Lugar:</span>{" "}
                                {denuncia.lugar}
                            </div>
                        </div>
                    </div>

                    {/* Historial de estados */}
                    {/* <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">
                                Historial de Estados
                            </span>
                        </div>
                        <div className="space-y-2">
                            {denuncia.historial.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white p-3 rounded-lg border-l-4 shadow-sm ${
                                        estadoColors[item.estado] || "border-slate-400 text-slate-700 bg-slate-50"
                                    }`}
                                >
                                    <div className="text-xs text-slate-600">{item.fecha}</div>
                                    <div className={`font-bold mb-1 ${estadoColors[item.estado]?.split(" ").find(c => c.startsWith("text-")) || "text-slate-700"}`}>
                                        {item.estado}
                                    </div>
                                    <div className="text-slate-700 text-sm">{item.comentario}</div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* Gestión y comentarios */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5 text-purple-600" />
                            <span className="font-semibold text-purple-700">
                                Gestión y Comentarios
                            </span>
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-bold text-slate-700 mb-1">
                                Comentario:
                            </label>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 resize-none"
                                rows="3"
                                placeholder="Agregar comentario sobre el estado de la denuncia..."
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-bold text-slate-700 mb-1">
                                Estado:
                            </label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="cursor-pointer w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200"
                            >
                                <option value="" disabled>Seleccionar un nuevo estado</option>
                                <option value="recibida">Recibida</option>
                                <option value="en_proceso">En proceso</option>
                                <option value="rechazada">Rechazada</option>
                                <option value="aceptada">Aceptada</option>
                                <option value="finalizada">Finalizada</option>
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <a
                                href={`${API_URL}/denuncias/adjunto/descargar/${denuncia.id}`}
                                className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all duration-200 flex items-center shadow-sm"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Descargar evidencias
                            </a>
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 px-6 py-4 border-t border-slate-200 bg-white">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={onUpdate}
                        className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg"
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Actualizar Estado
                    </button>
                </div>
            </div>
        </div>
    );
}