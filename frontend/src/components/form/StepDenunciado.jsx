import { motion, AnimatePresence } from "framer-motion";
import { useDenuncias } from "../../context/DenunciasContext";

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
        denunciante,
        handleDenuncianteChange,
        handleDenuncianteDigits,
        isStepDenunciadoValid,
    } = useDenuncias();

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
            },
        },
    };

    const buttonVariants = {
        hover: { scale: 1.03 },
        tap: { scale: 0.98 },
    };

    const documentTypeVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.3 }
        },
        exit: { opacity: 0, height: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-6 space-y-6 text-gray-800"
        >

            {/* Tipo de documento */}
            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Tipo de documento <span className="text-red-500">*</span>
                </label>
                <select
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                >
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CEDULA">Cédula</option>
                </select>
            </motion.div>

            {/* Campos según tipo de documento */}
            <AnimatePresence mode="wait">
                {(tipoDocumento === "DNI" || tipoDocumento === "CEDULA") && (
                    <motion.div
                        key="dniFields"
                        variants={documentTypeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-4"
                    >
                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                {tipoDocumento === "DNI" ? "DNI" : "Cédula"} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={dniDenunciado}
                                onChange={(e) => setDniDenunciado(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                placeholder={`Ingrese el ${tipoDocumento === "DNI" ? "DNI" : "número de cédula"}`}
                                maxLength={8}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombreDenunciado}
                                onChange={(e) => setNombreDenunciado(e.target.value)}
                                placeholder="Ingrese el nombre"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Apellidos <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={apellidosDenunciado}
                                onChange={(e) => setApellidosDenunciado(e.target.value)}
                                placeholder="Ingrese los apellidos"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
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
                        className="space-y-4"
                    >
                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                RUC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ruc"
                                value={denunciante.ruc}
                                onChange={handleDenuncianteDigits("ruc", 11)}
                                placeholder="Ingrese el RUC"
                                maxLength={11}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Representante legal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="representante"
                                value={denunciante.representante}
                                onChange={handleDenuncianteChange}
                                placeholder="Ingrese el representante legal"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Razón social <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="razonSocial"
                                value={denunciante.razonSocial}
                                onChange={handleDenuncianteChange}
                                placeholder="Ingrese la razón social"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Campos comunes */}
            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Dirección <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={direccionDenunciado}
                    onChange={(e) => setDireccionDenunciado(e.target.value)}
                    placeholder="Ingrese la dirección"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Celular <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    value={celularDenunciado}
                    onChange={(e) => setCelularDenunciado(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    placeholder="Ingrese el número de celular"
                    maxLength={9}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Ejemplo: 987654321</p>
            </motion.div>

            {/* Botones de navegación */}
            <motion.div
                variants={itemVariants}
                className="flex justify-between pt-6 border-t border-gray-200"
            >
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={onPrev}
                    className="cursor-pointer px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200"
                >
                    Atrás
                </motion.button>

                <motion.button
                    variants={buttonVariants}
                    whileHover={isStepDenunciadoValid ? "hover" : {}}
                    whileTap={isStepDenunciadoValid ? "tap" : {}}
                    type="button"
                    onClick={onNext}
                    disabled={!isStepDenunciadoValid}
                    className={`cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${!isStepDenunciadoValid
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                        }`}
                >
                    <span>Siguiente</span>
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        whileHover={{ x: 4 }} // pa la derecha
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </motion.svg>
                </motion.button>

                
            </motion.div>
        </motion.div>
    );
}