import { createContext, useContext, useState } from "react";

const DenunciasContext = createContext();

export function DenunciasProvider({ children }) {
    // Estado para StepDetails
    const [descripcion, setDescripcion] = useState("");
    const [lugar, setLugar] = useState("");
    const [fecha, setFecha] = useState("");
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const newFiles = e.target.files ? Array.from(e.target.files) : [];
        const validFiles = newFiles.filter((file) => file.size <= 10 * 1024 * 1024);
        if (validFiles.length !== newFiles.length) {
            setError("Algunos archivos superan los 10MB y no se han añadido.");
        } else {
            setError("");
        }
        setFiles((prev) => [...prev, ...validFiles]);
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
            }}
        >
            {children}
        </DenunciasContext.Provider>
    );
}

export function useDenuncias() {
    return useContext(DenunciasContext);
}