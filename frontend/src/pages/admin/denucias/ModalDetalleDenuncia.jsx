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

export default function ModalDetalleDenuncia({
    open,
    denuncia,
    newComment,
    setNewComment,
    newStatus,
    setNewStatus,
    onClose,
    onActualizar,
}) {
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
                            {denuncia.id}
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
                                {denuncia.denunciante}
                            </div>
                            <div className="text-slate-600 text-sm">
                                DNI: {denuncia.denuncianteDni}
                            </div>
                        </div>
                        {/* Denunciado */}
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-red-600" />
                                <span className="font-semibold text-red-700">Denunciado</span>
                            </div>
                            <div className="text-slate-900 font-medium">{denuncia.contra}</div>
                            <div className="text-slate-600 text-sm">
                                DNI: {denuncia.denunciadoDni}
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
                            {denuncia.detalleIncidente}
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 text-slate-700 text-sm">
                            <div>
                                <span className="font-semibold">Fecha:</span>{" "}
                                {new Date(denuncia.fechaIncidente).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            <div>
                                <span className="font-semibold">Lugar:</span>{" "}
                                {denuncia.lugarIncidente}
                            </div>
                        </div>
                    </div>

                    {/* Historial de estados */}
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
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
                                    className="bg-white p-3 rounded-lg border-l-4 border-emerald-400 shadow-sm"
                                >
                                    <div className="text-xs text-slate-600">{item.fecha}</div>
                                    <div className="font-bold text-emerald-700">{item.estado}</div>
                                    <div className="text-slate-700 text-sm">{item.comentario}</div>
                                </div>
                            ))}
                        </div>
                    </div>

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
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
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
                                className="cursor-pointer w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            >
                                <option value="Registrada">Registrada</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Cerrada">Cerrada</option>
                                <option value="Archivada">Archivada</option>
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <button
                                onClick={() => alert("Descargando evidencias...")}
                                className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all duration-200 flex items-center shadow-sm"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Descargar evidencias
                            </button>
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
                        onClick={onActualizar}
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