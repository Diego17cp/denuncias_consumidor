import { InputField, Loader } from "dialca-ui";
import logo from "../../assets/logo.jpeg";
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
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Loader size={10} />
        </div>
    )

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
            {/* Header  */}
            <header className="py-5 px-6 bg-white shadow-sm">
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="Logo Municipal"
                        className="h-12 object-contain"
                    />
                    <span className="ml-2 text-lg font-semibold text-gray-700">Municipalidad JLO</span>
                </Link>
            </header>

            {/* Contenido principal centrado */}
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="p-1 bg-gradient-to-r from-muni-primary to-muni-secondary"></div>
                    
                    <div className="px-8 py-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
                            <p className="text-gray-500">Ingresa a tu cuenta administrativa</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                label="DNI"
                                value={dni}
                                onChange={handleDniChange}
                                minLength={8}
                                maxLength={8}
                                required
                                className="bg-gray-50 border-gray-200 focus:border-muni-primary"
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
                                className="bg-gray-50 border-gray-200 focus:border-muni-primary"
                            />
                            
                            <button
                                className={`w-full py-3.5 px-4 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center
                                    ${isFormValid 
                                        ? 'cursor-pointer bg-muni-primary shadow-md hover:shadow-lg' 
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                                type="submit"
                                disabled={!isFormValid}
                            >
                                {isSubmitting ? (
                                    <Loader size={6} />
                                ) : (
                                    <span>Iniciar Sesión</span>
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>¿Necesitas ayuda? <a href="#" className="text-muni-primary hover:underline">Contactar soporte</a></p>
                        </div>
                    </div>
                </div>
            </div>
            
        </main>
    );
}

export default Login;