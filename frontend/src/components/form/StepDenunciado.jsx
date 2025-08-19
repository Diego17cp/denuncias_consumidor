import { motion, AnimatePresence } from "framer-motion";
import { useDenuncias } from "../../context/DenunciasContext";
import { FaUser, FaBuilding, FaAddressCard } from "react-icons/fa";

export default function StepDatosDenunciado({ onNext, onPrev }) {
    const {
        tipoDocumento,
        setTipoDocumento,
        nombreDenunciado,
        setNombreDenunciado,
        apellidosDenunciado,
        setApellidosDenunciado,
        dniDenunciado,
        setDniDenunciado,
        direccionDenunciado,
        setDireccionDenunciado,
        celularDenunciado,
        setCelularDenunciado,
        rucDenunciado,
        setRucDenunciado,
        representanteDenunciado,
        setRepresentanteDenunciado,
        razonSocialDenunciado,
        setRazonSocialDenunciado,
        isStepDenunciadoValid
    } = useDenuncias();

    // Animaciones simplificadas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    const buttonVariants = {
        hover: { scale: 1.03 },
        tap: { scale: 0.98 }
    };

    const documentTypeVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
        exit: { opacity: 0, height: 0 }
    };

    // Opciones de tipo de documento
    const documentOptions = [
        { value: "DNI", label: "DNI", icon: <FaUser /> },
        { value: "RUC", label: "RUC", icon: <FaBuilding /> },
        { value: "CEDULA", label: "Cédula", icon: <FaAddressCard /> }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
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
                            variants={buttonVariants}
                            onClick={() => setTipoDocumento(option.value)}
                            className={`
                                cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border-2
                                transition-all duration-200
                                ${tipoDocumento === option.value
                                    ? 'bg-blue-50 border-muni-primary text-muni-primary'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
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
                        variants={documentTypeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <motion.div variants={itemVariants} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                {tipoDocumento === "DNI" ? "DNI" : "Cédula"} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={dniDenunciado}
                                onChange={(e) => setDniDenunciado(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                placeholder={`Ingrese ${tipoDocumento === "DNI" ? "DNI" : "cédula"}`}
                                maxLength={8}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombreDenunciado}
                                onChange={(e) => setNombreDenunciado(e.target.value)}
                                placeholder="Nombre completo"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Apellidos <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={apellidosDenunciado}
                                onChange={(e) => setApellidosDenunciado(e.target.value)}
                                placeholder="Apellidos completos"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {tipoDocumento === "RUC" && (
                    <motion.div
                        key="rucFields"
                        variants={documentTypeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <motion.div variants={itemVariants} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                RUC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={rucDenunciado}
                                onChange={(e) => setRucDenunciado(e.target.value.replace(/\D/g, "").slice(0, 11))}
                                placeholder="Ingrese RUC"
                                maxLength={11}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Representante Legal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={representanteDenunciado}
                                onChange={(e) => setRepresentanteDenunciado(e.target.value)}
                                placeholder="Nombre completo"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Razón Social <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={razonSocialDenunciado}
                                onChange={(e) => setRazonSocialDenunciado(e.target.value)}
                                placeholder="Razón social completa"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Campos comunes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1 md">
                    <label className="block text-sm font-medium text-gray-700">
                        Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={direccionDenunciado}
                        onChange={(e) => setDireccionDenunciado(e.target.value)}
                        placeholder="Dirección completa"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-1 md">
                    <label className="block text-sm font-medium text-gray-700">
                        Celular
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            +51
                        </span>
                        <input
                            type="tel"
                            value={celularDenunciado}
                            onChange={(e) => setCelularDenunciado(e.target.value.replace(/\D/g, "").slice(0, 9))}
                            placeholder="987654321"
                            maxLength={9}
                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Botones de navegación */}
            <motion.div
                variants={itemVariants}
                className="flex justify-between pt-4"
            >
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={onPrev}
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Atrás</span>
                </motion.button>

                <motion.button
                    variants={buttonVariants}
                    whileHover={isStepDenunciadoValid ? "hover" : {}}
                    whileTap={isStepDenunciadoValid ? "tap" : {}}
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
                    <span>Siguiente</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}