import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";

export const BaseLayout = () => {
    const location = useLocation();

    // Verifica si la rutaes de admin pues
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Renderiza el Header solo si no es una ruta de administrador */}
            {!isAdminRoute && <Header />}
            <main className="flex-1 w-full">
                <Outlet />
            </main>
        </div>
    );
};
