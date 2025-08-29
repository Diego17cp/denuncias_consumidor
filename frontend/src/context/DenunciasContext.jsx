import { createContext, useContext, useEffect, useState } from "react";
import { getServiceData } from "../services/documentService";
import axios from "axios";
import { toast } from "sonner";

const MAX_FILES = 10;
const MAX_SIZE_MB = 20;
const ALLOWED_MIME = new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"text/plain",
	"application/zip",
	"application/x-zip-compressed",
	"multipart/x-zip",
]);
const ALLOWED_EXT = new Set([
	"jpg",
	"jpeg",
	"png",
	"gif",
	"webp",
	"pdf",
	"doc",
	"docx",
	"txt",
	"zip",
]);

const DenunciasContext = createContext();

export function DenunciasProvider({ children }) {
	// Estado para StepDetails
	const [descripcion, setDescripcion] = useState("");
	const [lugar, setLugar] = useState("");
	const [fecha, setFecha] = useState("");
	const [files, setFiles] = useState([]);
	const [error, setError] = useState("");
	const [trackingCode, setTrackingCode] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDenunciaEnviada, setIsDenunciaEnviada] = useState(false);

	// Lógica de archivos
	const totalSize = files.reduce(
		(acc, file) => acc + file.size / (1024 * 1024),
		0
	);
	const isFilesLimitReached =
		files.length > MAX_FILES || totalSize > MAX_SIZE_MB;

	const isAllowedFile = (file) => {
		const ext = file.name.split(".").pop().toLowerCase();
		if (file.type && ALLOWED_MIME.has(file.type)) return true;
		if (ALLOWED_EXT.has(ext)) return true;
		return false;
	};

	const handleFileChange = (e) => {
		setError("");
		const selectedFiles = Array.from(e.target.files);

		const rejected = [];
		const accepted = [];

		for (const file of selectedFiles) {
			if (!isAllowedFile(file)) {
				rejected.push(file.name);
				continue;
			}
			accepted.push(file);
		}

		if (rejected.length > 0) {
			setError(
				`Los siguientes archivos no están permitidos: ${rejected.join(
					", "
				)}. Tipos permitidos: ${Array.from(ALLOWED_EXT).join(", ")}.`
			);
		}

		if (accepted.length === 0) {
			return;
		}

		const totalFiles = files.length + accepted.length;
		if (totalFiles > MAX_FILES) {
			setError((prev) =>
				prev
					? `${prev} Solo puedes subir ${MAX_FILES} archivos.`
					: `Solo puedes subir ${MAX_FILES} archivos.`
			);
			return;
		}

		const newFiles = [...files, ...accepted];
		const totalSizeMB = newFiles.reduce(
			(acc, file) => acc + file.size / (1024 * 1024),
			0
		);
		if (totalSizeMB > MAX_SIZE_MB) {
			setError((prev) =>
				prev
					? `${prev} El tamaño total de los archivos no debe superar los ${MAX_SIZE_MB}MB.`
					: `El tamaño total de los archivos no debe superar los ${MAX_SIZE_MB}MB.`
			);
			return;
		}

		setFiles(newFiles);
	};

	const removeFile = (index) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	// Estado para StepDenunciado
	const [denunciado, setDenunciado] = useState({
		tipoDocumento: "DNI", // Tipo de documento del denunciado
		dni: "",
		nombres: "",
		direccion: "",
		celular: "",
		ruc: "",
		representante: "",
		razonSocial: "",
	});

	const handleDenunciadoChange = (e) => {
		const { name, value } = e.target;
		setDenunciado((prev) => ({ ...prev, [name]: value }));
	};

	const handleDenunciadoDigits = (name, maxLen) => (e) => {
		const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, maxLen);
		setDenunciado((prev) => ({ ...prev, [name]: onlyDigits }));
	};

	// Estado para StepDenunciante
	const [tipoDocumento, setTipoDocumento] = useState("DNI");

	// Autocompletar nombre o razon social dependiendo el tipo de documento
	useEffect(() => {
		const fetchDniData = async () => {
			if (
				denunciado.tipoDocumento !== "DNI" ||
				denunciado.dni.trim().length !== 8
			)
				return;
			const data = await getServiceData("dni", denunciado.dni);
			if (data)
				setDenunciado((prev) => ({
					...prev,
					nombres: data.nombre,
					direccion: data.direccion,
				}));
		};

		const getRucData = async () => {
			if (
				denunciado.tipoDocumento !== "RUC" ||
				denunciado.ruc.trim().length !== 11
			)
				return;
			const data = await getServiceData("ruc", denunciado.ruc);
			if (data) setDenunciado((prev) => ({ ...prev, razonSocial: data }));
		};

		if (
			denunciado.tipoDocumento === "DNI" &&
			denunciado.dni.trim().length === 8
		) {
			fetchDniData();
		} else if (
			denunciado.tipoDocumento === "RUC" &&
			denunciado.ruc.trim().length === 11
		) {
			getRucData();
		}
	}, [denunciado.tipoDocumento, denunciado.dni, denunciado.ruc]);

	const [denunciante, setDenunciante] = useState({
		dni: "",
		nombres: "",
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
	useEffect(() => {
		const fetchDniData = async () => {
			if (tipoDocumento !== "DNI" || denunciante.dni.trim().length !== 8)
				return;
			const data = await getServiceData("dni", denunciante.dni);
			if (data)
				setDenunciante((prev) => ({
					...prev,
					nombres: data.nombre,
					domicilio: data.direccion,
					distrito: data.distrito,
					provincia: data.provincia,
					departamento: data.departamento,
				}));
		};

		const getRucData = async () => {
			if (tipoDocumento !== "RUC" || denunciante.ruc.trim().length !== 11)
				return;
			const data = await getServiceData("ruc", denunciante.ruc);
			if (data)
				setDenunciante((prev) => ({ ...prev, razonSocial: data }));
		};

		if (tipoDocumento === "DNI" && denunciante.dni.trim().length === 8) {
			fetchDniData();
		} else if (
			tipoDocumento === "RUC" &&
			denunciante.ruc.trim().length === 11
		) {
			getRucData();
		}
	}, [tipoDocumento, denunciante.dni, denunciante.ruc]);
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
		denunciado.tipoDocumento === "DNI"
			? denunciado.dni.trim().length === 8 &&
			  denunciado.nombres.trim() !== "" &&
			  denunciado.direccion.trim() !== "" &&
			  (denunciado.celular.trim().length === 9 ||
					denunciado.celular.trim() === "")
			: denunciado.tipoDocumento === "CEDULA"
			? denunciado.dni.trim() !== "" &&
			  denunciado.nombres.trim() !== "" &&
			  denunciado.direccion.trim() !== "" &&
			  (denunciado.celular.trim().length === 9 ||
					denunciado.celular.trim() === "")
			: denunciado.ruc.trim().length === 11 &&
			  denunciado.representante.trim() !== "" &&
			  denunciado.razonSocial.trim() !== "" &&
			  denunciado.direccion.trim() !== "" &&
			  (denunciado.celular.trim().length === 9 ||
					denunciado.celular.trim() === "");

	const isStepDenuncianteValid = anonimo
		? true
		: tipoDocumento === "DNI" || tipoDocumento === "CEDULA"
		? denunciante.dni.trim().length === 8 &&
		  denunciante.nombres.trim() !== "" &&
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
			es_anonimo: anonimo ? "1" : "0",
		};
		formData.append("denuncia", JSON.stringify(denunciaData));
		for (const file of files) formData.append("adjuntos[]", file);

		// Data del denunciado
		const denunciadoData = {
			nombre: denunciado.nombres,
			razon_social:
				denunciado.ruc.length > 0 && denunciado.razonSocial
					? denunciado.razonSocial
					: null,
			representante_legal:
				denunciado.tipoDocumento === "RUC" && denunciado.representante
					? denunciado.representante
					: null,
			tipo_documento:
				denunciado.tipoDocumento === "CEDULA"
					? "CE"
					: denunciado.tipoDocumento,
			documento:
				denunciado.tipoDocumento === "DNI"
					? denunciado.dni
					: denunciado.tipoDocumento === "RUC"
					? denunciado.ruc
					: denunciado.tipoDocumento === "CEDULA"
					? denunciado.dni
					: null,
			direccion: denunciado.direccion,
			celular:
				denunciado.celular.length === 9 ? denunciado.celular : null,
		};
		formData.append("denunciado", JSON.stringify(denunciadoData));

		// Data del denunciante
		const denuncianteData = {
			nombre: denunciante.nombres,
			documento:
				tipoDocumento === "DNI"
					? denunciante.dni
					: tipoDocumento === "RUC"
					? denunciante.ruc
					: tipoDocumento === "CEDULA"
					? denunciante.dni
					: null,
			tipo_documento: tipoDocumento === "CEDULA" ? "CE" : tipoDocumento,
			razon_social:
				tipoDocumento === "RUC" && denunciante.razonSocial
					? denunciante.razonSocial
					: null,
			direccion: denunciante.domicilio,
			celular:
				denunciante.celular.length === 9 ? denunciante.celular : null,
			distrito: denunciante.distrito,
			provincia: denunciante.provincia,
			departamento: denunciante.departamento,
			email: denunciante.correo,
			sexo: denunciante.sexo,
		};
		formData.append(
			"denunciante",
			!anonimo ? JSON.stringify(denuncianteData) : null
		);

		// Enviar la denuncia
		try {
			setIsSubmitting(true);
			const response = await axios.post(
				`${API_BASE_URL}/denuncias`,
				formData
			);
			if (response.data.success || response.status === 200) {
				const data = response.data;
				setTrackingCode(data.tracking_code);
				setIsDenunciaEnviada(true); // Actualiza el estado a true
				toast.success(data.message || "Denuncia enviada exitosamente");
				return true;
			}
			return false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Error al enviar la denuncia:", error);
			}
			console.error("Error al enviar la denuncia:", error);
			toast.error("Error al enviar la denuncia");
			setIsDenunciaEnviada(false); // Asegúrate de que el estado sea false en caso de error
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

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
				denunciado,
				setDenunciado,
				handleDenunciadoChange,
				handleDenunciadoDigits,
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
				handleSubmit,
				isSubmitting,
				trackingCode,
				isDenunciaEnviada,
			}}
		>
			{children}
		</DenunciasContext.Provider>
	);
}

export function useDenuncias() {
	return useContext(DenunciasContext);
}
