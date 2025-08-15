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

    return (
        <div className="p-4 space-y-4 text-black">
            {/* Tipo de documento */}
            <div>
                <label className="block mb-2 text-sm font-medium">Tipo de documento</label>
                <select
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full p-3 border border-black text-black rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                >
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CEDULA">CEDULA</option>
                </select>
            </div>

            {/* Si es DNI */}
            {(tipoDocumento === "DNI" || tipoDocumento === "CEDULA") &&  (
                <>
                    <div>
                        <label className="block mb-2 text-sm font-medium">DNI</label>
                        <input
                            type="text"
                            value={dniDenunciado}
                            onChange={(e) => setDniDenunciado(e.target.value.replace(/\D/g, "").slice(0, 8))}
                            placeholder="Ingrese el DNI"
                            maxLength={8}
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Nombre</label>
                        <input
                            type="text"
                            value={nombreDenunciado}
                            onChange={(e) => setNombreDenunciado(e.target.value)}
                            placeholder="Ingrese el nombre"
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Apellidos</label>
                        <input
                            type="text"
                            value={apellidosDenunciado}
                            onChange={(e) => setApellidosDenunciado(e.target.value)}
                            placeholder="Ingrese los apellidos"
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                </>
            )}

            {/* Si es RUC */}
            {tipoDocumento === "RUC" && (
                <>
                    <div>
                        <label className="block mb-2 text-sm font-medium">RUC</label>
                        <input
                            type="text"
                            name="ruc"
                            value={denunciante.ruc}
                            onChange={handleDenuncianteDigits("ruc", 11)}
                            placeholder="Ingrese el RUC"
                            maxLength={11}
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Representante legal</label>
                        <input
                            type="text"
                            name="representante"
                            value={denunciante.representante}
                            onChange={handleDenuncianteChange}
                            placeholder="Ingrese el representante legal"
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Razón social</label>
                        <input
                            type="text"
                            name="razonSocial"
                            value={denunciante.razonSocial}
                            onChange={handleDenuncianteChange}
                            placeholder="Ingrese la razón social"
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                </>
            )}

            {/* Campos comunes */}
            <div>
                <label className="block mb-2 text-sm font-medium">Dirección</label>
                <input
                    type="text"
                    value={direccionDenunciado}
                    onChange={(e) => setDireccionDenunciado(e.target.value)}
                    placeholder="Ingrese la dirección"
                    className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium">Celular</label>
                <input
                    type="tel"
                    value={celularDenunciado}
                    onChange={(e) => setCelularDenunciado(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    placeholder="Ingrese el número de celular"
                    maxLength={9}
                    className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={onPrev}
                    className="px-6 py-2 cursor-pointer rounded-lg font-semibold bg-gray-300 text-black hover:bg-gray-400 transition"
                >
                    Atrás
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isStepDenunciadoValid}
                    className={`px-6 py-2 cursor-pointer rounded-lg font-semibold bg-blue-600 text-white transition ${
                        !isStepDenunciadoValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    }`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
