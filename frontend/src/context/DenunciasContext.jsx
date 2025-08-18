import { createContext, useContext, useState } from "react";

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
    const totalSize = files.reduce((acc, file) => acc + file.size / (1024 * 1024), 0);
    const isFilesLimitReached = files.length > MAX_FILES || totalSize > MAX_SIZE_MB;

    const handleFileChange = (e) => {
        setError("");
        const selectedFiles = Array.from(e.target.files);
        const totalFiles = files.length + selectedFiles.length;

        if (totalFiles > MAX_FILES) {
            setError("Solo puedes subir 10 archivos.");
            return;
        }

        const newFiles = [...files, ...selectedFiles];
        const totalSizeMB = newFiles.reduce((acc, file) => acc + file.size / (1024 * 1024), 0);
        if (totalSizeMB > MAX_SIZE_MB) {
            setError("El tamaño total de los archivos no debe superar los 20MB.");
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

    // Estado para StepDenunciante
    const [tipoDocumento, setTipoDocumento] = useState("DNI");
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
    });

    const handleDenuncianteChange = (e) => {
        const { name, value } = e.target;
        setDenunciante((prev) => ({ ...prev, [name]: value }));
    };

    const handleDenuncianteDigits = (name, maxLen) => (e) => {
        const only = (e.target.value || "").replace(/\D/g, "").slice(0, maxLen);
        setDenunciante((p) => ({ ...p, [name]: only }));
    };

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
            celularDenunciado.trim().length === 9
            : tipoDocumento === "CEDULA"
            ? dniDenunciado.trim() !== "" && // longitud minima 
            nombreDenunciado.trim() !== "" &&
            apellidosDenunciado.trim() !== "" &&
            direccionDenunciado.trim() !== "" &&
            celularDenunciado.trim().length === 9
            : denunciante.ruc.trim().length === 11 &&
            denunciante.representante.trim() !== "" &&
            denunciante.razonSocial.trim() !== "" &&
            direccionDenunciado.trim() !== "" &&
            celularDenunciado.trim().length === 9;

    const isStepDenuncianteValid =
        tipoDocumento === "DNI"
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
                // StepDenunciante
                tipoDocumento,
                setTipoDocumento,
                denunciante,
                setDenunciante,
                handleDenuncianteChange,
                handleDenuncianteDigits,
                isStepDetailsValid,
                isStepDenunciadoValid,
                isStepDenuncianteValid,
            }}
        >
            {children}
        </DenunciasContext.Provider>
    );
}

export function useDenuncias() {
    return useContext(DenunciasContext);
}