import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";

// Componentes
import { Loader } from "dialca-ui";
import { BaseLayout } from "./layouts/BaseLayout";
import { FormDenuncia } from "./pages/public/Form/FormDenuncia";
import  TrackingDenuncia from "./pages/public/Tracking/TrackingDenuncia";

// Importa el provider
import { DenunciasProvider } from "./context/DenunciasContext";

// Paginas Admin
const Login = lazy(() => import("./pages/admin/Login"));
// const DashboardAdmin = lazy(() => import("./pages/admin/Dashboard"));
// const AdminsHistorial = lazy(() => import("./pages/admin/AdminsHistorial"));
// const SearchAdmin = lazy(() =>
// 	import("./pages/admin/AdministrarUsuarios/SearchAdmin")
// );
// const DenunciasRecibidas = lazy(() =>
// 	import("./pages/admin/denuncias/DenunciasRecibidas")
// );
// const SearchDenuncia = lazy(() =>
// 	import("./pages/admin/denucias/SearchDenuncia")
// );
// const Denuncias = lazy(() => import("./pages/admin/denucias/Denuncias"));
// const AdministrarUsuarios = lazy(() =>
// 	import("./pages/admin/administrarUsuarios/AdministrarUsuarios")
// );

// // Paginas Generales
// const NotFound = lazy(() => import("./pages/404"));
// const Tracking = lazy(() => import("./pages/public/Tracking/TrackingDenuncia"));
// const InfoDenuncia = lazy(() => import("./pages/public/Form/InfoDenuncia"));
// const Unauthorized = lazy(() => import("./pages/Unauthorized"));

function App() {
    return (
        <DenunciasProvider>
            <BrowserRouter>
                <Suspense
                    fallback={
                        <div className="flex min-h-screen w-full justify-center items-center h-screen">
                            <Loader />
                        </div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<BaseLayout />}>
                            <Route index element={<FormDenuncia />} />
                        <Route path="/tracking-denuncia" element={<TrackingDenuncia />} />
                        </Route>
                        <Route path="/admin/login" element={<Login />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </DenunciasProvider>
    );
}

export default App;
