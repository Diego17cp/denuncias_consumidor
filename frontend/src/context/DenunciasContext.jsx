import { createContext, useContext, useEffect, useState } from "react";
import { getServiceData } from "../services/documentService";
import axios from "axios";

const MAX_FILES = 10;
const MAX_SIZE_MB = 20;

const DenunciasContext = createContext();

export function DenunciasProvider({ children }) {
	// Estado para StepDetails
	const [descripcion, setDescripcion] = useState("");
	const [lugar, setLugar] = useState("");
	const [fecha, setFecha] = useState("");
	const [files, setFiles] = useState([]);
	const [error, setError] = useState("");

	// Lógica de archivos
	const totalSize = files.reduce(
		(acc, file) => acc + file.size / (1024 * 1024),
		0
	);
	const isFilesLimitReached =
		files.length > MAX_FILES || totalSize > MAX_SIZE_MB;

	const handleFileChange = (e) => {
		setError("");
		const selectedFiles = Array.from(e.target.files);
		const totalFiles = files.length + selectedFiles.length;

		if (totalFiles > MAX_FILES) {
			setError("Solo puedes subir 10 archivos.");
			return;
		}

		const newFiles = [...files, ...selectedFiles];
		const totalSizeMB = newFiles.reduce(
			(acc, file) => acc + file.size / (1024 * 1024),
			0
		);
		if (totalSizeMB > MAX_SIZE_MB) {
			setError(
				"El tamaño total de los archivos no debe superar los 20MB."
			);
			return;
		}

		setFiles(newFiles);
	};

	const removeFile = (index) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	// Estado para StepDenunciado
	const [nombreDenunciado, setNombreDenunciado] = useState("");
	const [apellidosDenunciado, setApellidosDenunciado] = useState("");
	const [dniDenunciado, setDniDenunciado] = useState("");
	const [direccionDenunciado, setDireccionDenunciado] = useState("");
	const [celularDenunciado, setCelularDenunciado] = useState("");
	const [rucDenunciado, setRucDenunciado] = useState("");

	// Estado para StepDenunciante
	const [tipoDocumento, setTipoDocumento] = useState("DNI");

	// Autocompletar nombre o razon social dependiendo el tipo de documento
	useEffect(() => {
		const fetchDniData = async () => {
			if (!tipoDocumento === "DNI" && !dniDenunciado.trim().length === 8) return;
			const data = await getServiceData("dni", dniDenunciado);
			if (data) setNombreDenunciado(data);
		};
        const getRucData = async () => {
            if (!tipoDocumento === "RUC" && !rucDenunciado.trim().length === 11) return;
            const data = await getServiceData("ruc", rucDenunciado);
            if (data) setDenunciadoRazonSocial(data);
        }

        if (tipoDocumento === "DNI" && dniDenunciado.trim().length === 8) {
            fetchDniData();
        } else if (tipoDocumento === "RUC" && rucDenunciado.trim().length === 11) {
            getRucData();
        }
	});

	const [denunciante, setDenunciante] = useState({
		dni: "",
		nombres: "",
		apellidos: "",
		domicilio: "",
		departamento: "",
		provincia: "",
		distrito: "",
		celular: "",
		correo: "",
		ruc: "",
		representante: "",
		razonSocial: "",
		sexo: "",
	});

	const handleDenuncianteChange = (e) => {
		const { name, value } = e.target;
		setDenunciante((prev) => ({ ...prev, [name]: value }));
	};

	const handleDenuncianteDigits = (name, maxLen) => (e) => {
		const only = (e.target.value || "").replace(/\D/g, "").slice(0, maxLen);
		setDenunciante((p) => ({ ...p, [name]: only }));
	};

	// Estado para denuncia anónima
	const [anonimo, setAnonimo] = useState(false);

	// Validaciones
	const isStepDetailsValid =
		descripcion.trim().length >= 50 &&
		descripcion.trim().length <= 200 &&
		lugar.trim() !== "" &&
		fecha.trim() !== "" &&
		files.length > 0 &&
		files.length <= MAX_FILES &&
		totalSize <= MAX_SIZE_MB;

	const isStepDenunciadoValid =
		tipoDocumento === "DNI"
			? dniDenunciado.trim().length === 8 &&
			  nombreDenunciado.trim() !== "" &&
			  apellidosDenunciado.trim() !== "" &&
			  direccionDenunciado.trim() !== "" &&
			  (celularDenunciado.trim().length === 9 ||
					celularDenunciado.trim() === "")
			: tipoDocumento === "CEDULA"
			? dniDenunciado.trim() !== "" && // longitud minima
			  nombreDenunciado.trim() !== "" &&
			  apellidosDenunciado.trim() !== "" &&
			  direccionDenunciado.trim() !== "" &&
			  (celularDenunciado.trim().length === 9 ||
					celularDenunciado.trim() === "")
			: denunciante.ruc.trim().length === 11 &&
			  denunciante.representante.trim() !== "" &&
			  denunciante.razonSocial.trim() !== "" &&
			  direccionDenunciado.trim() !== "" &&
			  (celularDenunciado.trim().length === 9 ||
					celularDenunciado.trim() === "");

	const isStepDenuncianteValid = anonimo
		? true
		: tipoDocumento === "DNI"
		? denunciante.dni.trim().length === 8 &&
		  denunciante.nombres.trim() !== "" &&
		  denunciante.apellidos.trim() !== "" &&
		  denunciante.domicilio.trim() !== "" &&
		  denunciante.departamento.trim() !== "" &&
		  denunciante.provincia.trim() !== "" &&
		  denunciante.distrito.trim() !== "" &&
		  denunciante.celular.trim().length === 9 &&
		  denunciante.correo.trim() !== ""
		: denunciante.ruc.trim().length === 11 &&
		  denunciante.razonSocial.trim() !== "" &&
		  denunciante.representante.trim() !== "" &&
		  denunciante.domicilio.trim() !== "" &&
		  denunciante.departamento.trim() !== "" &&
		  denunciante.provincia.trim() !== "" &&
		  denunciante.distrito.trim() !== "" &&
		  denunciante.celular.trim().length === 9 &&
		  denunciante.correo.trim() !== "";

    const API_BASE_URL = import.meta.env.VITE_CI_API_BASE_URL;

    const handleSubmit = async () => {
        const formData = new FormData();
        // Data de la denuncia Base
        const denunciaData = {
            descripcion: descripcion,
            lugar: lugar,
            fecha_incidente: fecha,
            es_anonimo: anonimo,
        }
        formData.append("denuncia", JSON.stringify(denunciaData));
        for (const file of files) formData.append("adjuntos[]", file);
        // Data del denunciado
        const denunciadoData = {
            nombre: denunciado.nombre,
            razon_social: denunciado.ruc.length > 0 && denunciado.razonSocial ? denunciado.razonSocial : null,
            representante_legal: denunciado.tipoDocumento === "RUC" && denunciado.representante ? denunciado.representante : null,
            tipo_documento: denunciado.tipoDocumento,
            documento: denunciado.tipoDocumento === "DNI" ? dniDenunciado : denunciado.tipoDocumento === "RUC" ? rucDenunciado : denunciado.tipoDocumento === "CEDULA" ? dniDenunciado : null,
            direccion: denunciado.direccion,
            celular: denunciante.celular.length === 9 ? denunciante.celular : null
        }
        formData.append("denunciado", JSON.stringify(denunciadoData));
        // Data del denunciante
        const denuncianteData = {
            nombre: denunciante.nombres,
            documento: tipoDocumento === "DNI" ? denunciante.dni : tipoDocumento === "RUC" ? denunciante.ruc : tipoDocumento === "CEDULA" ? denunciante.dni : null,
            tipo_documento: tipoDocumento,
            direccion: denunciante.direccion,
            celular: denunciante.celular.length === 9 ? denunciante.celular : null,
            distrito: denunciante.distrito,
            provincia: denunciante.provincia,
            departamento: denunciante.departamento,
            email: denunciante.correo,
            telefono: denunciante.telefono.length === 9 ? denunciante.telefono : null,
            sexo: denunciante.sexo,
        }
        formData.append("denunciante", !anonimo ? JSON.stringify(denuncianteData) : null);
        // Enviar la denuncia
        // Simulación: consolear cada elemento de formData de forma legible
        console.group("Simulación de envío de FormData");
        for (const [key, value] of formData.entries()) {
            // Archivos
            if (value instanceof File) {
                console.log(
                    `${key}: File { name: "${value.name}", size: ${(value.size / 1024).toFixed(
                        2
                    )} KB, type: "${value.type}" }`
                );
                continue;
            }

            // Intentar parsear JSON para mostrar objetos legibles
            let parsed = null;
            if (typeof value === "string") {
                try {
                    parsed = JSON.parse(value);
                } catch (e) {
                    parsed = null;
                }
            }

            if (parsed && typeof parsed === "object") {
                console.log(`${key}:`);
                console.log(parsed); // muestra el objeto de forma legible en consola
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        console.groupEnd();
        try {
            const response = await axios.post(`${API_BASE_URL}/denuncias`, formData);
            if (response.data.success || response.status === 200) {
                // aqui se manejaria el pasar el formulario a la siguiente etapa
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error al enviar la denuncia:", error.response?.data.message || error.message);
            }
            console.error("Error al enviar la denuncia:", error);
        }
    }

	return (
		<DenunciasContext.Provider
			value={{
				// StepDetails
				descripcion,
				setDescripcion,
				lugar,
				setLugar,
				fecha,
				setFecha,
				files,
				setFiles,
				error,
				setError,
				handleFileChange,
				removeFile,
				totalSize,
				isFilesLimitReached,
				MAX_FILES,
				MAX_SIZE_MB,
				// StepDenunciado
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
				// StepDenunciante
				tipoDocumento,
				setTipoDocumento,
				denunciante,
				setDenunciante,
				handleDenuncianteChange,
				handleDenuncianteDigits,
				anonimo,
				setAnonimo,
				isStepDetailsValid,
				isStepDenunciadoValid,
				isStepDenuncianteValid,
                handleSubmit
			}}
		>
			{children}
		</DenunciasContext.Provider>
	);
}

export function useDenuncias() {
	return useContext(DenunciasContext);
}
