import { motion, AnimatePresence } from "framer-motion";
import { useDenuncias } from "../../context/DenunciasContext";
import { FaUser, FaBuilding, FaAddressCard, FaUserSecret } from "react-icons/fa"; // Icono para anónimo

export default function StepDenunciante({ onNext, onPrev }) {
    const {
        tipoDocumento,
        setTipoDocumento,
        denunciante,
        handleDenuncianteChange,
        handleDenuncianteDigits,
        isStepDenuncianteValid,
        anonimo,
        setAnonimo,
        handleSubmit
    } = useDenuncias();

    // Animaciones optimizadas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.2 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.03 },
        tap: { scale: 0.98 }
    };

    const documentTypeVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { 
            opacity: 1, 
            height: "auto",
            transition: { duration: 0.25 }
        },
        exit: { opacity: 0, height: 0 }
    };

    // Opciones de documento
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
            className="mb-6 p-4 space-y-6"
        >
            {/* Selector de tipo de documento y denuncia anónima */}
            <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Tipo de Documento o Denuncia <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                    {documentOptions.map((option) => (
                        <motion.button
                            key={option.value}
                            type="button"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={() => {
                                setAnonimo(false);
                                setTipoDocumento(option.value);
                            }}
                            className={`
                                cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border-2
                                transition-all ${tipoDocumento === option.value && !anonimo
                                    ? 'bg-blue-50 border-muni-primary text-muni-primary'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }
                            `}
                        >
                            <div className="text-xl mb-1">{option.icon}</div>
                            <span className="text-sm font-medium">{option.label}</span>
                        </motion.button>
                    ))}
                    {/* Botón de denuncia anónima */}
                    <motion.button
                        type="button"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        onClick={() => {
                            setAnonimo(true);
                            setTipoDocumento(""); // limpiar tipo de documento
                        }}
                        className={`
                            cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border-2
                            transition-all ${anonimo
                                ? 'bg-blue-50 border-muni-primary text-muni-primary'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }
                        `}
                    >
                        <div className="text-xl mb-1"><FaUserSecret /></div>
                        <span className="text-sm font-medium">Anónima</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Si NO es anónimo, muestra los campos */}
            {!anonimo && (
                <>
                    {/* Campos según tipo de documento */}
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
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="dni"
                                            value={denunciante.dni}
                                            onChange={handleDenuncianteDigits("dni", 8)}
                                            inputMode="numeric"
                                            placeholder={`Ingrese ${tipoDocumento === "DNI" ? "DNI" : "cédula"}`}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                                        />
                                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                                            denunciante.dni?.length === 8 ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                            {denunciante.dni?.length || 0}/8
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nombre completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        value={denunciante.nombres}
                                        readOnly
                                        placeholder="Nombres completos"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                                    />
                                </motion.div>


                                {/* <motion.div variants={itemVariants} className="space-y-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Apellidos <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={denunciante.apellidos}
                                        onChange={handleDenuncianteChange}
                                        placeholder="Apellidos completos"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                                    />
                                </motion.div> */}
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
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="ruc"
                                            value={denunciante.ruc}
                                            onChange={handleDenuncianteDigits("ruc", 11)}
                                            inputMode="numeric"
                                            placeholder="Ingrese RUC"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                                        />
                                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                                            denunciante.ruc?.length === 11 ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                            {denunciante.ruc?.length || 0}/11
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Representante Legal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="representante"
                                        value={denunciante.representante}
                                        onChange={handleDenuncianteChange}
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
                                        name="razonSocial"
                                        value={denunciante.razonSocial}
                                        onChange={handleDenuncianteChange}
                                        placeholder="Razón social completa"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Campos comunes */}
                    <motion.div variants={itemVariants} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Domicilio <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="domicilio"
                            value={denunciante.domicilio}
                            onChange={handleDenuncianteChange}
                            placeholder="Dirección completa"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Departamento <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="departamento"
                                value={denunciante.departamento}
                                onChange={handleDenuncianteChange}
                                placeholder="Departamento"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Provincia <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="provincia"
                                value={denunciante.provincia}
                                onChange={handleDenuncianteChange}
                                placeholder="Provincia"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Distrito <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="distrito"
                                value={denunciante.distrito}
                                onChange={handleDenuncianteChange}
                                placeholder="Distrito"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Celular <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+51</span>
                            <input
                                type="tel"
                                name="celular"
                                value={denunciante.celular}
                                onChange={handleDenuncianteDigits("celular", 9)}
                                inputMode="numeric"
                                placeholder="987654321"
                                className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                            />
                            <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                                denunciante.celular?.length === 9 ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                                {denunciante.celular?.length || 0}/9
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Correo electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="correo"
                            value={denunciante.correo}
                            onChange={handleDenuncianteChange}
                            placeholder="correo@gmail.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-primary focus:border-muni-primary transition-all ease-in-out duration-300"
                        />
                    </motion.div>
                    <div>
                        <motion.div variants={itemVariants} className="space-y-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Sexo <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-6">
                                <label className={`inline-flex items-center cursor-pointer ${denunciante.sexo === 'M' ? 'text-muni-primary' : 'text-gray-700'}`}>
                                    <input
                                        type="radio"
                                        name="sexo"
                                        value="M"
                                        checked={denunciante.sexo === 'M'}
                                        onChange={handleDenuncianteChange}
                                        className="form-radio h-4 w-4 text-muni-primary focus:ring-muni-primary"
                                    />
                                    <span className="ml-2">Masculino</span>
                                </label>

                                <label className={`inline-flex items-center cursor-pointer ${denunciante.sexo === 'F' ? 'text-muni-primary' : 'text-gray-700'}`}>
                                    <input
                                        type="radio"
                                        name="sexo"
                                        value="F"
                                        checked={denunciante.sexo === 'F'}
                                        onChange={handleDenuncianteChange}
                                        className="form-radio h-4 w-4 text-muni-primary focus:ring-muni-primary"
                                    />
                                    <span className="ml-2">Femenino</span>
                                </label>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}

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
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Atrás</span>
                </motion.button>

                <motion.button
                    variants={buttonVariants}
                    whileHover={isStepDenuncianteValid ? "hover" : {}}
                    whileTap={isStepDenuncianteValid ? "tap" : {}}
                    type="button"
                    onClick={() => {
                        handleSubmit();
                        onNext();
                    }}
                    disabled={!isStepDenuncianteValid}
                    className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                        !isStepDenuncianteValid
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-muni-secondary text-white hover:bg-muni-primary"
                    }`}
                >
                    <span>Enviar denuncia</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}