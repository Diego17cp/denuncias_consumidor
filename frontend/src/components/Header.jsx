import  logo  from "../assets/logo.jpeg"
import { Link } from "react-router";
import { Modal } from "dialca-ui"
// import { ConfirmLogout } from "./Admin/ConfirmLogout";
import { useHeader } from "../hooks/useHeader";
import { useAuth } from "../hooks/admin/useAuth";


const Header = () => {
	const {
		isFormPage,
		isAdminSection,
		showLogoutModal,
		openLogoutModal,
		closeLogoutModal,
	} = useHeader();
	const {
		confirmLogout
	} = useAuth();

	return (
		<header className="header shadow-md w-full bg-white py-4 px-4">
			<nav className="nav-container d-flex justify-between items-center">
				<div className="nav-content flex items-center justify-between w-full">
					<Link
						className="logo-section flex items-center gap-4 font-titles"
						to = { isAdminSection ? "/admin" : "/" }
						title="Página Principal"
					>
						<img
							alt="Logo Municipal"
							className="nav-logo size-20 md:w-12 md:h-16 object-contain"
							src={logo}
						/>
						<h3 className="font-semibold hidden md:flex! flex-col text-xl text-gray-700">
							<span>Municipalidad Distrital de</span>
							<span>José Leonardo Ortiz</span>
						</h3>
					</Link>
					{isAdminSection ? (
						<button
							onClick={openLogoutModal}
							className="bg-red-400 text-sm md:text-base text-center text-white font-semibold px-4 py-3 rounded-lg ml-17 cursor-pointer hover:scale-110 hover:bg-red-800 transition-all ease-in-out duration-300"
						>
							Cerrar Sesión
						</button>
					) : isFormPage ? (
						<Link
							to="/tracking-denuncia"
							className="bg-muni-secondary text-sm md:text-base text-center text-white font-semibold px-4 py-3 rounded-lg ml-17 cursor-pointer hover:scale-110 hover:bg-muni-primary transition-all ease-in-out duration-300"
						>
							Ver Estado de denuncia
						</Link>
					) : (
						<Link
							to="/"
							className="bg-muni-secondary text-center text-white font-semibold px-4 py-3 rounded-lg ml-17 cursor-pointer hover:scale-110 hover:bg-muni-primary transition-all ease-in-out duration-300"
						>
							Volver al Formulario
						</Link>
					)}
					{showLogoutModal && (
					<Modal
						title="Confirmar Cierre de Sesión"
						isOpen={showLogoutModal}
						onClose={closeLogoutModal}
						size="xl"
						classes={{
							closeButton: "cursor-pointer"
						}}
					>
						<p className="text-lg text-center text-gray-800 font-bold my-4">¿Estás seguro de que deseas cerrar sesión?</p>
						<div className="flex justify-center mt-6 gap-3">
							<button
								onClick={closeLogoutModal}
								className="px-4 py-2 bg-white border border-gray-200 text-sm rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300 ease-in-out cursor-pointer"
							>
								Cancelar
							</button>
							<button
								onClick={() => confirmLogout("s")}
								className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out cursor-pointer"
							>
								Confirmar
							</button>
						</div>
					</Modal>
				)}
				</div>
			</nav>
		</header>
	);
};

export default Header;