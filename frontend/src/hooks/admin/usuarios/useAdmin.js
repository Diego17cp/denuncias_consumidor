import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { getServiceData } from "../../../services/documentService";

export const useAdmin = () => {
	const API_URL = import.meta.env.VITE_CI_API_BASE_URL;

	const [createUser, setCreateUser] = useState({
		dni: "",
		nombre: "",
		password: "",
		rol: "",
		estado: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState({
		password: false,
		confirmPassword: false,
	});
	const [createErrors, setCreateErrors] = useState({});
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchDNIName = async () => {
            if (createUser.dni.length !== 8) return
            const data = await getServiceData("dni", createUser.dni);
            if (data) setCreateUser((prev) => ({ ...prev, nombre: data.nombre }));
        }
        if (createUser.dni.length === 8) fetchDNIName();
    }, [createUser.dni]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCreateUser((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	const handleShowPassword = (field) => {
		setShowPassword((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};
	const validateCreateUser = () => {
		const errors = {};
		if (!createUser.dni) errors.dni = "DNI es requerido";
		if (!createUser.nombre) errors.nombre = "Nombre es requerido";
		if (!createUser.password) errors.password = "Contraseña es requerida";
		if (createUser.password !== createUser.confirmPassword) {
			errors.confirmPassword = "Las contraseñas no coinciden";
		}
		setCreateErrors(errors);
		return Object.keys(errors).length === 0;
	};
	const handleCreateUser = async (e) => {
		e.preventDefault();
		if (!validateCreateUser()) {
			toast.error("Por favor, corrige los errores en el formulario.");
			return;
		}
        try {
            setIsCreating(true);
            const response = await axios.post(
                `${API_URL}/admin`,
                {
                    dni: createUser.dni,
                    nombre: createUser.nombre,
                    password: createUser.password,
                    rol: createUser.rol,
                    estado: "1",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (response.data.success || response.status === 201) {
                toast.success(response.data.message || "Usuario creado exitosamente.");
            } else {
                toast.error(response.data.error || "Error al crear el usuario.");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Error al crear el usuario.");
            }
            console.error(error);
        } finally {
            setIsCreating(false);
        }
	};

    return {
        createUser,
        showPassword,
        isCreating,
        handleShowPassword,
        handleInputChange,
        handleCreateUser,
        createErrors
    };
};
