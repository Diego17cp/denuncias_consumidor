import React from "react";
import { X, User, Shield } from "lucide-react";

export default function ModalDetalleHistorial({ open, detalles, getActionConfig, formatDate, onClose }) {
    if (!open || !detalles) return null;

    const actionCfg = getActionConfig(detalles.accion, detalles.motivo);

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Detalles de la Acción</h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Información General</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Acción</label>
                                <p className="mt-1 text-sm text-gray-900">{actionCfg.label}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(detalles.created_at || detalles.fecha)}</p>
                            </div>
                        </div>

                        {/* Motivo / descripción de la acción */}
                        {detalles.motivo && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Motivo / Detalle</label>
                            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{detalles.motivo}</p>
                          </div>
                        )}
                    </div>

                    {/* Usuario afectado */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Usuario Afectado</h4>
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-900">{detalles.nombre_afectado}</p>
                                <p className="text-xs text-blue-700">DNI: {detalles.dni_afectado}</p>
                            </div>
                        </div>
                    </div>

                    {/* Administrador */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Administrador que realizó la acción</h4>
                        <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-purple-900">{detalles.nombre_administrador}</p>
                                <p className="text-xs text-purple-700">DNI: {detalles.dni_administrador}</p>
                            </div>
                        </div>
                    </div>


                    {/* Botón de cerrar */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}