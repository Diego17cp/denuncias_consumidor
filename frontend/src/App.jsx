import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";

// Componentes
import { Loader } from "dialca-ui";
import { Toaster } from "sonner";

// Importa el provider
import { DenunciasProvider } from "./context/DenunciasContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

// Lazy load del resto de páginas y layout para reducir bundle inicial
const BaseLayout = lazy(() => import("./layouts/BaseLayout"));
const FormDenuncia = lazy(() => import("./pages/public/Form/FormDenuncia"));
const TrackingDenuncia = lazy(() =>
	import("./pages/public/Tracking/TrackingDenuncia")
);
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Usuarios = lazy(() => import("./pages/admin/Usuarios"));
const AdminsHistorial = lazy(() => import("./pages/admin/AdminsHistorial"));
const Denuncias = lazy(() => import("./pages/admin/denucias/Denuncias"));
const Login = lazy(() => import("./pages/admin/Login"));
const NotFound = lazy(() => import("./pages/404"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

function App() {
	return (
		<BrowserRouter>
			<DenunciasProvider>
				<AuthProvider>
					<Suspense
						fallback={
							<div className="flex min-h-screen w-full justify-center items-center h-screen">
								<Loader />
							</div>
						}
					>
						<Routes>
							{/* Layout lazy */}
							<Route path="/" element={<BaseLayout />}>
								<Route index element={<FormDenuncia />} />
								<Route
									path="/tracking-denuncia"
									element={<TrackingDenuncia />}
								/>
								<Route path="/admin">
									<Route
										index
										element={
											<ProtectedRoute
												allowedRoles={[
													"admin",
													"super_admin",
												]}
											>
												<Navigate to="/admin/dashboard" />
											</ProtectedRoute>
										}
									/>
									<Route
										path="dashboard"
										element={
											<ProtectedRoute
												allowedRoles={[
													"admin",
													"super_admin",
												]}
											>
												<Dashboard />
											</ProtectedRoute>
										}
									/>
									<Route
										path="usuarios"
										element={
											<ProtectedRoute
												allowedRoles={["super_admin"]}
											>
												<Usuarios />
											</ProtectedRoute>
										}
									/>
									<Route
										path="historial"
										element={
											<ProtectedRoute
												allowedRoles={["super_admin"]}
											>
												<AdminsHistorial />
											</ProtectedRoute>
										}
									/>
									<Route
										path="denuncias"
										element={
											<ProtectedRoute
												allowedRoles={[
													"super_admin",
													"admin",
												]}
											>
												<Denuncias />
											</ProtectedRoute>
										}
									/>
									<Route
										path="unauthorized"
										element={<Unauthorized />}
									/>
								</Route>
							</Route>

							<Route path="/admin/login" element={<Login />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Suspense>
					<Toaster richColors closeButton />
				</AuthProvider>
			</DenunciasProvider>
		</BrowserRouter>
	);
}

export default App;
