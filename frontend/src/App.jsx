import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";

// Componentes
// import { loader } from "./components/loaders/Loader";
import { Layout } from "./layouts/Layout";

// Paginas Admin
const LoginAdmin = lazy(() => import("./pages/admin/Login"));
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
const FormularioDenuncia = lazy(() => import("./pages/public/Form/FormularioDenuncia"));



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
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<FormularioDenuncia />} />
                        <Route path="/tracking-denuncia" element={<Tracking />} />
                        <Route path="/admin/login" element={<LoginAdmin/>} />
                        <Route path="/unauthorized" element={<Unauthorized/>} />
                    </Route>
                </Routes>
                </Suspense>
        </BrowserRouter>
    )
}

export default App