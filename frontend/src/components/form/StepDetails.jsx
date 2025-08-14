import { FaClipboardCheck } from "react-icons/fa";
import { useDenuncias } from "../../context/DenunciasContext";

export default function StepDetalles() {
    const {
        descripcion,
        setDescripcion,
        lugar,
        setLugar,
        fecha,
        setFecha,
        files,
        error,
        handleFileChange,
    } = useDenuncias();

    return (
        <div className="p-4 space-y-4 text-black">
            {/* Descripción */}
            <div>
                <label className="block mb-3 text-sm font-medium">Descripción</label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe la denuncia o enumera las pruebas..."
                    className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>

            {/* Lugar */}
            <div>
                <label className="block mb-3 text-sm font-medium">Lugar</label>
                <input
                    type="text"
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    placeholder="Ej. No conozco JLO, Calle 28"
                    className="w-full p-3 border border-black text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>

            {/* Fecha */}
            <div>
                <label className="block mb-3 text-sm font-medium">Fecha</label>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full p-3 border border-black text-black rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>

            {/* Subir fotos */}
            <div>
                <label className="block mb-3 text-sm font-medium">
                    Subir fotos (máx. 10MB cada una)
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-black p-6 rounded-lg cursor-pointer hover:bg-gray-100">
                    <FaClipboardCheck className="text-black text-2xl mb-2" />
                    <span className="text-black">Haz clic o arrastra tus fotos aquí</span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                {files.length > 0 && (
                    <ul className="mt-2 text-sm list-disc pl-4">
                        {files.map((file, index) => (
                            <li key={index}>
                                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
