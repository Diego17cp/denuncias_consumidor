import React, { useState } from "react";
import { useTrackingCode } from "../tracking/Track";
import { FaFileDownload } from "react-icons/fa";
import { HiOutlineClipboardCheck } from "react-icons/hi";

const TrackingCodeScreen = () => {
  const { trackingCode } = useTrackingCode();
  const [copied, setCopied] = useState(false); // estado para la notificación

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(trackingCode);
    setCopied(true); // Muestra la notificación
    setTimeout(() => setCopied(false), 2000); // oculta la notificación dsp de 2 segundos
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 ">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-blue-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-green-600 dark:text-green-500 mb-4 flex items-center justify-center gap-2">
          Denuncia enviada exitosamente
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Su denuncia ha sido registrada correctamente.
          <br />
          <span className="font-bold text-gray-500 ">
            Guarde este código para hacer el seguimiento:
          </span>
        </p>

        <div className="relative">
          <div className="text-3xl font-mono font-bold text-[#002f59] bg-gray-300 border border-blue-300 dark:border-gray-600 p-4 rounded-md mb-2 select-all">
            {trackingCode}
          </div>
          <button
            onClick={handleCopy}
            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-md transition duration-150 ease-in-out mx-auto mb-2 w-full"
            title="Copiar código"
          >
            <HiOutlineClipboardCheck className="text-lg" />
            <span>Copiar código</span>
          </button>

          {/* notificación de copiado */}
          {copied && (
            <p className="text-green-600 pb-2 dark:text-green-400 text-sm mt-2">
              ¡Código copiado en el portapapeles!
            </p>
          )}
        </div>

        <button
          type="button"
          className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition w-full"
          onClick={() => alert("Aquí iría la descarga del archivo")}
        >
          <FaFileDownload className="text-lg" />
          Descargar archivo de denuncia
        </button>
      </div>
    </div>
  );
};

export default TrackingCodeScreen;