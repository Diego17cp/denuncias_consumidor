import React, { useState } from "react";
// import { useTrackingCode } from "../tracking/Track";
import { FaFileDownload } from "react-icons/fa";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { useDenuncias } from "../../context/DenunciasContext";
import { generarDenunciaPDF } from "../../services/pdfServices";
import { toast } from "sonner";
import { Loader } from "dialca-ui"

const TrackingCodeScreen = () => {
  // const { trackingCode } = useTrackingCode();
  const {
    trackingCode,
    descripcion,
    lugar,
    fecha,
    anonimo,
    denunciado,
    denunciante,
    tipoDocumento
  } = useDenuncias()
  const [copied, setCopied] = useState(false); // estado para la notificación
  const [isDownloading, setIsDownloading] = useState(false);

  const formData = {
    tracking_code: trackingCode,
    fecha_incidente: fecha,
    es_anonimo: anonimo,
    lugar: lugar,
    descripcion: descripcion,
    denunciado: {
      tipo_documento: denunciado.tipoDocumento,
      numero_documento: denunciado.dni.length === 8 && (denunciado.tipoDocumento === "DNI" || denunciado.tipoDocumento === "CEDULA") ? denunciado.dni : denunciado.ruc,
      nombre: denunciado.nombres,
      razon_social: denunciado.razonSocial,
      cargo: denunciado.cargo,
      representante_legal: denunciado.representanteLegal,
      domicilio: denunciado.direccion,
    },
    denunciante: {
      tipo_documento: tipoDocumento,
      numero_documento: denunciante.dni.length === 8 && (tipoDocumento === "DNI" || tipoDocumento === "CEDULA") ? denunciante.dni : denunciante.ruc,
      nombres: denunciante.nombres,
      sexo: denunciante.sexo,
      email: denunciante.correo,
      telefono: denunciante.celular,
      domicilio: denunciante.domicilio
    }
  }
  const handleDownload = () => {
		setIsDownloading(true);

		try {
			generarDenunciaPDF(formData);

			toast.success("PDF generado correctamente. Redirigiendo a la página principal...");

			// setTimeout(() => {
			// 	window.location.href = "/";
			// }, 3000);
		} catch (error) {
			console.error("Error al generar PDF:", error);
			toast.error("Ocurrió un error al generar PDF");
			setIsDownloading(false);
		} finally {
			setIsDownloading(false);
		}
	};
  
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
          onClick={handleDownload}
        >
          {isDownloading ? (
            <Loader size='md' />
          ) : (
            <>
              <FaFileDownload className="text-lg" />
              Descargar archivo de denuncia
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TrackingCodeScreen;