import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaBuilding, FaAddressCard } from "react-icons/fa";
import { Loader } from "dialca-ui";

export default function ModalAgregarDenunciado({ open, onClose, onSubmit }) {
    const [tipoDocumento, setTipoDocumento] = useState("DNI");
    const [form, setForm] = useState({
        dni: "",
        nombres: "",
        ruc: "",
        razonSocial: "",
        representante: "",
        direccion: "",
        celular: ""
    });
    // para manejar el estado de carga al consultar DNI o RUC - haz el axios y actualiza este estado diegazo
    const [isFetching, setIsFetching] = useState({ dni: false, ruc: false });

    const documentOptions = [
        { value: "DNI", label: "DNI", icon: <FaUser /> },
        { value: "RUC", label: "RUC", icon: <FaBuilding /> },
        { value: "CEDULA", label: "Cédula", icon: <FaAddressCard /> },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDigits = (name, max) => (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, max);
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTipoDocumento = (value) => {
        setTipoDocumento(value);
        setForm({
            dni: "",
            nombres: "",
            ruc: "",
            razonSocial: "",
            representante: "",
            direccion: "",
            celular: ""
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, tipoDocumento });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full"
            >
                <h2 className="text-xl font-bold mb-6 text-center">Agregar Denunciado</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo de Documento <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {documentOptions.map((option) => (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => handleTipoDocumento(option.value)}
                                    className={`
                                        cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border-2
                                        transition-all duration-200
                                        ${tipoDocumento === option.value
                                            ? "bg-blue-50 border-blue-600 text-blue-600"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    <div className="text-2xl mb-1">{option.icon}</div>
                                    <span className="font-medium text-sm">{option.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Campos dinámicos según tipo de documento */}
                    <AnimatePresence mode="wait">
                        {(tipoDocumento === "DNI" || tipoDocumento === "CEDULA") && (
                            <motion.div
                                key="dniFields"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {tipoDocumento === "DNI" ? "DNI" : "Cédula"} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="dni"
                                        value={form.dni}
                                        onChange={handleDigits("dni", 8)}
                                        placeholder={`Ingrese ${tipoDocumento === "DNI" ? "DNI" : "Cédula"}`}
                                        maxLength={8}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nombre completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        value={form.nombres}
                                        onChange={handleChange}
                                        placeholder="Nombre completo"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {tipoDocumento === "RUC" && (
                            <motion.div
                                key="rucFields"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        RUC <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ruc"
                                        value={form.ruc}
                                        onChange={handleDigits("ruc", 11)}
                                        placeholder="Ingrese el RUC"
                                        maxLength={11}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Razón Social <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="razonSocial"
                                        value={form.razonSocial}
                                        onChange={handleChange}
                                        placeholder="Razón Social"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Representante Legal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="representante"
                                        value={form.representante}
                                        onChange={handleChange}
                                        placeholder="Representante Legal"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Campos comunes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Dirección <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="direccion"
                                value={form.direccion}
                                onChange={handleChange}
                                placeholder="Dirección completa"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Celular
                            </label>
                            <input
                                type="tel"
                                name="celular"
                                value={form.celular}
                                onChange={handleDigits("celular", 9)}
                                placeholder="987654321"
                                maxLength={9}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-5 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer px-5 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}