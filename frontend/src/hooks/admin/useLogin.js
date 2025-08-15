import { useState } from "react";
import { useAuth } from "./useAuth";
import axios from "axios";
import { toast } from "sonner";

export const useLogin = () => {
	const [dni, setDni] = useState("");
	const [password, setPassword] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { login } = useAuth();

	const isFormValid = dni.length === 8 && password.length >= 8;

	const toggleVisibility = () => setIsVisible(!isVisible);
	const handleDniChange = (e) => {
		const dniVal = e.target.value.replace(/\D/g, "");
		setDni(dniVal);
	};
	const handlePasswordChange = (e) => {
		const passwordVal = e.target.value;
		setPassword(passwordVal);
	};
	const handleSubmit = async (e) => {
		e.prevent.default();
		if (isSubmitting || !isFormValid) return;
		setIsSubmitting(true);
		setError(null);
		try {
			const success = await login(dni, password);
			if (success) toast.success("Inicio de sesión exitoso");
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.error || "Error de red");
				toast.error(err.response?.data?.error || "Error de red");
			} else {
				setError("Error inesperado");
				toast.error("Error inesperado");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

    return {
        dni, 
        isVisible,
        password,
        error,
        toggleVisibility,
        handleDniChange,
        handlePasswordChange,
        isFormValid,
        isSubmitting,
        handleSubmit
    }
};
