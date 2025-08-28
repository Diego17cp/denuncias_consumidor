import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const isAdminRoute = location.pathname.startsWith("/admin");

	const API_BASE_URL = import.meta.env.VITE_CI_API_BASE_URL;

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/refresh`, {
					withCredentials: true,
				});
				if (response.data.user) {
					setIsAuthenticated(true);
					setUser(response.data.user);
				} else {
					setIsAuthenticated(false);
					setUser(null);
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					console.error(
						"Error refreshing auth token:",
						error.response?.data?.error
					);
				} else console.error("Unexpected error:", error);
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkAuth();
	}, [API_BASE_URL]);

	const login = async (dni, password) => {
		try {
			const response = await axios.post(
				`${API_BASE_URL}/login`,
				{ dni, password },
				{
					withCredentials: true,
				}
			);
			if (
				response.data.success ||
				response.data.user ||
				response.status === 200
			) {
				setIsAuthenticated(true);
				setUser(response.data.user);
				return true;
			}
			return false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Error logging in:", error.response?.data?.error);
				toast.error(error.response?.data?.error || 'Error desconocido al iniciar sesión.')
			} else console.error("Unexpected error:", error);
			return false;
		}
	};
	const confirmLogout = (conf) => {
		switch (conf) {
			case "si":
			case "yes":
			case "ok":
			case "y":
			case "s":
			case "1":
				logout();
		}
	};
	const logout = async () => {
		await axios.post(
			`${API_BASE_URL}/logout`,
			{},
			{ withCredentials: true }
		);
		setIsAuthenticated(false);
		setUser(null);
		navigate("/admin/login", { replace: true });
	};
	const checkUserInfo = async () => {
		try {
			if (!isAuthenticated) return;
			const response = await axios.get(`${API_BASE_URL}/refresh`, {
				withCredentials: true,
			});
			if (response.data.forceLogout) {
				toast.error(
					"Tu sesión ha expirado o tu cuenta ha sido desactivada"
				);
				logout();
				return;
			}
			if (response.data.role_changed) {
				const user = response.data.user;
				setUser({
					id: user.id,
					dni: user.dni,
					rol: user.rol,
					nombre: user.nombre || "Administrador",
					estado: user.estado || "1",
				});
				toast.info(`Se ha actualizado tu información.`, {
					description: `Tu rol ha cambiado a ${user.rol}.`,
				});
			}
		} catch (error) {
			console.error(
				"Error al verificar la información del usuario",
				error
			);
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 401) {
					if (error.response.data?.forceLogout) {
						toast.error(
							error.response.data?.error ||
								"Tu sesión ha expirado"
						);
						logout();
					}
				}
			}
		}
	};
	useEffect(() => {
		if (isAuthenticated && isAdminRoute) {
			checkUserInfo();
			const interval = setInterval(checkUserInfo, 30 * 1000);
			return () => clearInterval(interval);
		}
	}, [isAuthenticated]);
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				login,
				logout,
				loading,
				confirmLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
