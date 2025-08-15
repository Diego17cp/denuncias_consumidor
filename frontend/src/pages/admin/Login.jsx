
import { InputField, Loader } from "dialca-ui";
import logo from "../../assets/logo.jpeg"
import { Link, Navigate } from "react-router";
import { useLogin } from "../../hooks/admin/useLogin";
import { useAuth } from "../../hooks/admin/useAuth";

export const Login = () => {
    const {
        dni,
        handleDniChange,
        password,
        handlePasswordChange,
        isVisible,
        toggleVisibility,
        isSubmitting,
        isFormValid,
        handleSubmit,
    } = useLogin()
    const { isAuthenticated, loading } = useAuth()

    if (isAuthenticated) return <Navigate to='/admin/dashboard' />
    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader size={10} />
        </div>
    )

    return (
		<main className="min-h-screen transition-all duration-300 ease-in-out">
			<header className="flex items-center justify-center md:justify-start! w-full py-7 px-5 transition-all duration-300 ease-in-out">
				<Link className="flex items-center gap-4" to="/">
					<img
						src={logo}
						alt="Logo Municipal"
						className="h-14 md:h-20! object-contain"
					/>
				</Link>
			</header>
			<div className="container mx-auto my-10 px-4 py-6 max-w-2xl!">
				<h2 className="text-5xl break-words text-center font-bold mb-6 text-muni-secondary animate-fade-in-down font-titles animate__animated animate__fadeInDown">
					Iniciar Sesión
				</h2>
				<form className="rounded-lg p-6" onSubmit={handleSubmit}>
					<div className="space-y-6">
						<InputField
							label="DNI"
							value={dni}
							onChange={handleDniChange}
							minLength={8}
							maxLength={8}
							required
						/>
						<InputField
							label="Contraseña"
							value={password}
							onChange={handlePasswordChange}
							isPassword={true}
							showPassword={isVisible}
							onToggleVisibility={toggleVisibility}
							minLength={8}
							required
						/>
						<button
							className="w-full p-3.5 font-body rounded-lg outline-none bg-muni-secondary cursor-pointer text-white text-xl transition-all duration-300 ease-in-out hover:bg-muni-primary hover:shadow-md disabled:bg-gray-200 disabled:cursor-not-allowed flex justify-center items-center"
							type="submit"
							disabled={!isFormValid}
						>
							{isSubmitting ? (
								<Loader size={6} />
							) : (
								"Iniciar Sesión"
							)}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
export default Login