import React from "react";

export default function ModalDenunciadoDecision({ open, onYes, onNo }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
                <h2 className="text-lg font-bold mb-4">¿Desea rellenar los datos del denunciado?</h2>
                <p className="mb-6 text-gray-600">Puede omitir este paso si no tiene información del denunciado.</p>
                <div className="flex justify-center gap-4">
                    <button
                        className="cursor-pointer px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        onClick={onYes}
                    >
                        Sí, rellenar
                    </button>
                    <button
                        className="cursor-pointer px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                        onClick={onNo}
                    >
                        No, omitir
                    </button>
                </div>
            </div>
        </div>
    );
}