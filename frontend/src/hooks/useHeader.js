import { useState } from "react";
import { useLocation } from "react-router";

export const useHeader = () => {
	const location = useLocation();
	const isFormPage = location.pathname === "/";
	const isAdminSection = location.pathname.includes("/admin") && !location.pathname.includes("/admin/login");
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const openLogoutModal = () => {setShowLogoutModal(true)};
	const closeLogoutModal = () => {setShowLogoutModal(false)};
	return {
		location,
		isFormPage,
		isAdminSection,
		showLogoutModal,
		openLogoutModal,
        closeLogoutModal,
	};
};