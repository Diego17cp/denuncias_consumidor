import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";

// Componentes
// import { loader } from "./components/loaders/Loader";

// Paginas Admin
const Login = lazy(() => import("./pages/admin/Login"));
const DashboardAdmin = lazy(() => import("./pages/admin/Dashboard"));
const AdminsHistorial = lazy(() => import("./pages/admin/AdminsHistorial"));
const SearchAdmin = lazy(() => import("./pages/admin/AdministrarUsuarios/SearchAdmin"));
const DenunciasRecibidas = lazy(() => import("./pages/admin/denuncias/DenunciasRecibidas"));
const SearchDenuncia = lazy(() => import("./pages/admin/denucias/SearchDenuncia"));
const Denuncias = lazy(() => import("./pages/admin/denucias/Denuncias"));
const AdministrarUsuarios = lazy(() => import("./pages/admin/administrarUsuarios/AdministrarUsuarios"));

// Paginas Generales
const NotFound = lazy(() => import("./pages/404"));
const Tracking = lazy(() => import("./pages/public/Tracking/TrackingDenuncia"));
const InfoDenuncia = lazy(() => import("./pages/public/Form/InfoDenuncia"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));



function App() {

    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div className="flex min-h-screen w-full justify-center items-center h-screen">
                        {/* <Loader  isBtn={true}/> */}
                    </div>
                }
                >
                
                </Suspense>
        </BrowserRouter>
    )
}

export default App