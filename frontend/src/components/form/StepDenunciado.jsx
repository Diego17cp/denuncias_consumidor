import { motion, AnimatePresence } from "framer-motion";
import { useDenuncias } from "../../context/DenunciasContext";
import { FaUser, FaBuilding, FaAddressCard } from "react-icons/fa";

export default function StepDatosDenunciado({ onNext, onPrev }) {
    const {
        denunciado,
        handleDenunciadoChange,
        handleDenunciadoDigits,
        isStepDenunciadoValid,
    } = useDenuncias();

    // Opciones de tipo de documento
    const documentOptions = [
        { value: "DNI", label: "DNI", icon: <FaUser /> },
        { value: "RUC", label: "RUC", icon: <FaBuilding /> },
        { value: "CEDULA", label: "Cédula", icon: <FaAddressCard /> },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="p-4 space-y-6"
        >
            {/* Selector de tipo de documento */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Tipo de Documento <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {documentOptions.map((option) => (
                        <motion.button
                            key={option.value}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() =>
                                handleDenunciadoChange({
                                    target: { name: "tipoDocumento", value: option.value },
                                })
                            }
                            className={`
                                cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border-2
                                transition-all duration-200
                                ${
                                    denunciado.tipoDocumento === option.value
                                        ? "bg-blue-50 border-muni-primary text-muni-primary"
                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >
                            <div className="text-2xl mb-1">{option.icon}</div>
                            <span className="font-medium text-sm">
                                {option.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Campos dinámicos según tipo de documento */}
            <AnimatePresence mode="wait">
                {(denunciado.tipoDocumento === "DNI" ||
                    denunciado.tipoDocumento === "CEDULA") && (
                    <motion.div
                        key="dniFields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {/* Campo de DNI o Cédula */}
                        <motion.div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                {denunciado.tipoDocumento === "DNI"
                                    ? "DNI"
                                    : "Cédula"}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="dni"
                                value={denunciado.dni}
                                onChange={handleDenunciadoDigits("dni", 8)}
                                placeholder={`Ingrese ${
                                    denunciado.tipoDocumento === "DNI"
                                        ? "DNI"
                                        : "Cédula"
                                }`}
                                maxLength={8}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        {/* Campo de Nombre */}
                        <motion.div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre completo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly={ denunciado.tipoDocumento === "RUC" || denunciado.tipoDocumento === "DNI" }
                                name="nombres"
                                value={denunciado.nombres}
                                onChange={handleDenunciadoChange}
                                placeholder="Nombre completo"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        {/* Campo de Apellidos */}
                        {/* <motion.div className="space-y-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Apellidos <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="apellidos"
                                value={denunciado.apellidos}
                                onChange={handleDenunciadoChange}
                                placeholder="Apellidos completos"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div> */}
                    </motion.div>
                )}

                {denunciado.tipoDocumento === "RUC" && (
                    <motion.div
                        key="rucFields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {/* Campo de RUC */}
                        <motion.div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                RUC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ruc"
                                value={denunciado.ruc}
                                onChange={handleDenunciadoDigits("ruc", 11)}
                                placeholder="Ingrese el RUC"
                                maxLength={11}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        {/* Campo de Razón Social */}
                        <motion.div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Razón Social <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="razonSocial"
                                value={denunciado.razonSocial}
                                onChange={handleDenunciadoChange}
                                placeholder="Razón Social"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        {/* Campo de Representante Legal */}
                        <motion.div className="space-y-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Representante Legal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="representante"
                                value={denunciado.representante}
                                onChange={handleDenunciadoChange}
                                placeholder="Representante Legal"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Campos comunes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="direccion"
                        value={denunciado.direccion}
                        onChange={handleDenunciadoChange}
                        placeholder="Dirección completa"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                    />
                </motion.div>

                <motion.div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Celular
                    </label>
                    <input
                        type="tel"
                        name="celular"
                        value={denunciado.celular}
                        onChange={handleDenunciadoDigits("celular", 9)}
                        placeholder="987654321"
                        maxLength={9}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                    />
                </motion.div>
            </div>

            {/* Botones de navegación */}
            <motion.div className="flex justify-between pt-4">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onPrev}
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Atrás
                </motion.button>

                <motion.button
                    whileHover={isStepDenunciadoValid ? { scale: 1.03 } : {}}
                    whileTap={isStepDenunciadoValid ? { scale: 0.98 } : {}}
                    type="button"
                    onClick={onNext}
                    disabled={!isStepDenunciadoValid}
                    className={`
                        cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium
                        transition ${!isStepDenunciadoValid
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-muni-secondary text-white hover:bg-muni-primary"
                        }
                    `}
                >
                    Siguiente
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}