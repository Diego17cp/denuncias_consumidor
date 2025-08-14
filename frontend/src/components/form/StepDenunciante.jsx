import { useDenuncias } from "../../context/DenunciasContext";

export default function StepDenunciante() {
    const {
        tipoDocumento,
        setTipoDocumento,
        denunciante,
        handleDenuncianteChange,
        handleDenuncianteDigits,
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
                </select>
            </div>

            {/* Persona natural (DNI) */}
            {tipoDocumento === "DNI" && (
                <>
                    <div>
                        <label className="block mb-2 text-sm font-medium">DNI</label>
                        <input
                            type="text"
                            name="dni"
                            value={denunciante.dni}
                            onChange={handleDenuncianteDigits("dni", 8)}
                            inputMode="numeric"
                            placeholder="Ingrese el DNI"
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Nombres</label>
                        <input
                            type="text"
                            name="nombres"
                            value={denunciante.nombres}
                            onChange={handleDenuncianteChange}
                            placeholder="Ingrese los nombres"
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={denunciante.apellidos}
                            onChange={handleDenuncianteChange}
                            placeholder="Ingrese los apellidos"
                            className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                </>
            )}

            {/* Empresa o persona juridicaa (RUC) */}
            {tipoDocumento === "RUC" && (
                <>
                    <div>
                        <label className="block mb-2 text-sm font-medium">RUC</label>
                        <input
                            type="text"
                            name="ruc"
                            value={denunciante.ruc}
                            onChange={handleDenuncianteDigits("ruc", 11)}
                            inputMode="numeric"
                            placeholder="Ingrese el RUC"
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
                <label className="block mb-2 text-sm font-medium">Domicilio</label>
                <input
                    type="text"
                    name="domicilio"
                    value={denunciante.domicilio}
                    onChange={handleDenuncianteChange}
                    placeholder="Ingrese el domicilio"
                    className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-2 text-sm font-medium">Departamento</label>
                    <input
                        type="text"
                        name="departamento"
                        value={denunciante.departamento}
                        onChange={handleDenuncianteChange}
                        placeholder="Departamento"
                        className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">Provincia</label>
                    <input
                        type="text"
                        name="provincia"
                        value={denunciante.provincia}
                        onChange={handleDenuncianteChange}
                        placeholder="Provincia"
                        className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">Distrito</label>
                    <input
                        type="text"
                        name="distrito"
                        value={denunciante.distrito}
                        onChange={handleDenuncianteChange}
                        placeholder="Distrito"
                        className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium">Celular</label>
                <input
                    type="tel"
                    name="celular"
                    value={denunciante.celular}
                    onChange={handleDenuncianteDigits("celular", 9)}
                    inputMode="numeric"
                    placeholder="Número de celular"
                    className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium">Correo electrónico</label>
                <input
                    type="email"
                    name="correo"
                    value={denunciante.correo}
                    onChange={handleDenuncianteChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full p-3 border border-black text-gray-600 placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>
        </div>
    );
}
