import { Suspense, lazy } from "react";

// Paginas Admin
const Login = lazy(() => import("./pages/admin/Login"));
const DashboardAdmin = lazy(() => import("./pages/admin/Dashboard"));
const AdminsHistorial = lazy(() => import("./pages/admin/AdminsHistorial"));
const SearchAdmin = lazy(() => import("./pages/admin/AdministrarUsuarios/SearchAdmin"));
const DenunciasRecibidas = lazy(() => import("./pages/admin/denuncias/DenunciasRecibidas"));
const SearchDenuncia = lazy(() => import("./pages/admin/denucias/SearchDenuncia"));
const Denuncias = lazy(() => import("./pages/admin/denucias/Denuncias"));
const AdministrarUsuarios = lazy(() => import("./pages/admin/administrarUsuarios/AdministrarUsuarios"));
