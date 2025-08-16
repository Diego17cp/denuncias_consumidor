import { motion, AnimatePresence } from "framer-motion";
import { useDenuncias } from "../../context/DenunciasContext";

export default function StepDenunciante({ onNext, onPrev }) {
    const {
        tipoDocumento,
        setTipoDocumento,
        denunciante,
        handleDenuncianteChange,
        handleDenuncianteDigits,
        isStepDenuncianteValid,
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
                                name="dni"
                                value={denunciante.dni}
                                onChange={handleDenuncianteDigits("dni", 8)}
                                inputMode="numeric"
                                placeholder={`Ingrese el ${tipoDocumento === "DNI" ? "DNI" : "número de cédula"}`}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Nombres <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombres"
                                value={denunciante.nombres}
                                onChange={handleDenuncianteChange}
                                placeholder="Ingrese los nombres"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Apellidos <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="apellidos"
                                value={denunciante.apellidos}
                                onChange={handleDenuncianteChange}
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
                                inputMode="numeric"
                                placeholder="Ingrese el RUC"
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
                    Domicilio <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="domicilio"
                    value={denunciante.domicilio}
                    onChange={handleDenuncianteChange}
                    placeholder="Ingrese el domicilio"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Departamento <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="departamento"
                        value={denunciante.departamento}
                        onChange={handleDenuncianteChange}
                        placeholder="Departamento"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Provincia <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="provincia"
                        value={denunciante.provincia}
                        onChange={handleDenuncianteChange}
                        placeholder="Provincia"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Distrito <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="distrito"
                        value={denunciante.distrito}
                        onChange={handleDenuncianteChange}
                        placeholder="Distrito"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Celular <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    name="celular"
                    value={denunciante.celular}
                    onChange={handleDenuncianteDigits("celular", 9)}
                    inputMode="numeric"
                    placeholder="Número de celular"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    name="correo"
                    value={denunciante.correo}
                    onChange={handleDenuncianteChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                />
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
                    type="submit" 
                    disabled={!isStepDenuncianteValid}
                    whileHover={isStepDenuncianteValid ? { scale: 1.05 } : {}}
                    whileTap={isStepDenuncianteValid ? { scale: 0.95 } : {}}
                    onClick={onNext}
                    className={`cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300
                            ${!isStepDenuncianteValid
                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        }`}
                >
                    Enviar denuncia
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        animate={isStepDenuncianteValid ? { x: 0 } : {}}
                        whileHover={isStepDenuncianteValid ? { x: 4 } : {}}
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