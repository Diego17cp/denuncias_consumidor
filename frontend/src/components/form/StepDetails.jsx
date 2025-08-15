import { FaClipboardCheck, FaTrash, FaUpload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDenuncias } from "../../context/DenunciasContext";
import { MdDescription } from "react-icons/md";

export default function StepDetalles({ onNext }) {
    const {
        descripcion,
        setDescripcion,
        lugar,
        setLugar,
        fecha,
        setFecha,
        files,
        setFiles,
        error,
        handleFileChange,
        isStepDetailsValid,
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

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-6 space-y-6 text-gray-800"
        >
            {/* Descripción */}
            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe detalladamente lo ocurrido..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                    rows={5}
                />
                <p className="mt-1 text-xs text-gray-500">
                    Incluye todos los detalles relevantes.
                </p>
            </motion.div>

            {/* Lugar */}
            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Lugar <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    placeholder="Ej: Av. Principal #123, Colonia Centro"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                />
            </motion.div>

            {/* Fecha */}
            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Fecha del incidente <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                />
            </motion.div>

            {/* Subir fotos */}
            <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Evidencia fotográfica (opcional)
                </label>

                <motion.label
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-8 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition duration-200"
                >
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <FaUpload className="text-blue-500 text-3xl mb-3" />
                    </motion.div>
                    <p className="text-gray-600 font-medium mb-1">
                        Arrastra tus fotos aquí o haz clic para seleccionar
                    </p>
                    <p className="text-gray-400 text-sm">
                        Formatos aceptados: JPG, PNG (máx. 10MB cada una)
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </motion.label>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {files.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-2"
                        >
                            <h4 className="text-sm font-medium text-gray-700">
                                Archivos seleccionados ({files.length})
                            </h4>
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <FaClipboardCheck className="text-green-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.preventDefault(); // para q no se actualice la pagina 
                                                const updatedFiles = files.filter((_, i) => i !== index);
                                                setFiles(updatedFiles);
                                            }}
                                            className="cursor-pointer text-red-500 hover:text-red-700 p-1"
                                            aria-label="Eliminar archivo"
                                        >
                                            <FaTrash />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Botón Siguiente */}
            <motion.div
                variants={itemVariants}
                className="flex justify-end pt-4 border-t border-gray-200"
            >
                <motion.button
                    variants={buttonVariants}
                    whileHover={isStepDetailsValid ? "hover" : {}}
                    whileTap={isStepDetailsValid ? "tap" : {}}
                    type="button"
                    onClick={onNext}
                    disabled={!isStepDetailsValid}
                    className={`cursor-pointer px-8 py-3 rounded-xl font-semibold text-white transition duration-200 flex items-center ${!isStepDetailsValid
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                        }`}
                >
                    Siguiente
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}