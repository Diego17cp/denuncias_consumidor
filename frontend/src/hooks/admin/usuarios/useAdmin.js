import { useCallback, useEffect, useState } from "react";
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
	const handleCreateUser = async () => {
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
                setCreateUser({
                    dni: "",
                    nombre: "",
                    password: "",
                    rol: "",
                    estado: "",
                    confirmPassword: "",
                });
                await reFetchUsers();
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
    
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoadingUsers(true)
            const response = await axios.get(`${API_URL}/admin`, {
                withCredentials: true
            })
            if (response.data.success || response.status === 200) {
                const data = response.data.data
                setUsers(data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Error al obtener los usuarios.");
            }
            console.error(error);
        } finally {
            setIsLoadingUsers(false);
        }
    }, [API_URL])
    const reFetchUsers = async () => {
        try {
            setIsLoadingUsers(true)
            const response = await axios.get(`${API_URL}/admin`, {
                withCredentials: true
            })
            if (response.data.success || response.status === 200) {
                const data = response.data.data
                setUsers(data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Error al obtener los usuarios.");
            }
            console.error(error);
        } finally {
            setIsLoadingUsers(false);
        }
    }
    
    const [dniSearch, setDniSearch] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchedUser, setSearchedUser] = useState(null)
    const handleSearchDni = (e) => {
        const formattedDni = e.target.value.replace(/\D/g, '').slice(0, 8);
        setDniSearch(formattedDni);
    }
    const searchUser = useCallback(async () => {
        try {
            setIsSearching(true)
            const response = await axios.get(`${API_URL}/admin/dni/${dniSearch}`, {
                withCredentials: true
            })
            if (response.data.success || response.status === 200) {
                setSearchedUser(response.data.data)
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                toast.error(e.response?.data?.error || "Error al buscar el usuario.");
            }
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    }, [API_URL, dniSearch])

    const [updatedPassword, setUpdatedPassword] = useState({
        password: "",
        confirmPassword: ""
    });
    const [updatedRol, setUpdatedRol] = useState("");
    const [updatedEstado, setUpdatedEstado] = useState("");

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPassword((prev) => ({ ...prev, [name]: value }));
    };
    const handleRoleChange = (e) => {
        setUpdatedRol(e.target.value);
    };
    const handleStateChange = (state) => {
        setUpdatedEstado(state);
    }
    const dataToSend = (actionType) => {
        switch (actionType) {
            case "password":
                return {
                    password: updatedPassword.password
                };
            case "rol":
                return {
                    rol: updatedRol
                };
            case "estado":
                return {
                    estado: updatedEstado
                };
            default:
                return {};
        }
    }
    const updateUser = async (dni, actionType, value = null) => {
        try {
            const payload = value !== null ? (
                actionType === "password" ? { password: value } :
                actionType === "rol" ? { rol: value } :
                actionType === "estado" ? { estado: value } : {}
            ) : dataToSend(actionType);

            console.log("Updating user", dni, actionType, payload);

            const response = await axios.post(`${API_URL}/admin/update/${dni}`, payload, {
                withCredentials: true
            });

            if (response.data.success || response.status === 200) {
                toast.success(response.data.message || "Usuario actualizado exitosamente.");
                setUpdatedPassword({ password: "", confirmPassword: "" });
                setUpdatedRol("");
                setUpdatedEstado("");
                fetchUsers()
                return true;
            } else {
                toast.error(response.data.error || "Error al actualizar el usuario.");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Error al actualizar el usuario.");
            }
            console.error(error);
            return false;
        }
    }

    return {
        createUser,
        showPassword,
        isCreating,
        handleShowPassword,
        handleInputChange,
        handleCreateUser,
        createErrors,
        users,
        fetchUsers,
        isLoadingUsers,
        dniSearch,
        isSearching,
        searchedUser,
        handleSearchDni,
        searchUser,
        updatedPassword,
        updatedRol,
        updatedEstado,
        handlePasswordChange,
        updateUser,
        handleRoleChange,
        handleStateChange
    };
};
