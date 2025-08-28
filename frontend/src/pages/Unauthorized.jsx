import React from "react";
import Header from "../components/Header";

export const Unauthorized = () => {
	return (
		<>
			<Header />

			<div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
				{/* Decorative floating shapes */}
				<div className="pointer-events-none absolute -left-24 -top-24 w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-300/30 to-blue-300/20 blur-3xl animate-rotate-slow" />
				<div className="pointer-events-none absolute -right-28 -bottom-24 w-60 h-60 rounded-2xl bg-gradient-to-br from-rose-200/30 to-pink-200/10 blur-3xl animate-pulse-slow" />

				<main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
					<div className="max-w-4xl w-full text-center">
						<div className="inline-flex items-center justify-center mb-8">
							<div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-2xl transform -rotate-6">
								<span className="text-6xl font-extrabold text-white select-none">
									403
								</span>
							</div>
						</div>

						<h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
							Acceso Denegado
						</h1>
						<p className="text-slate-600 max-w-2xl mx-auto mb-8">
							No tienes permisos suficientes para ver este módulo.
							Si crees que debería tener acceso, solicita permisos
							a un administrador o revisa tus credenciales.
						</p>

						<div className="flex items-center justify-center gap-4 mb-10">
							<button
								onClick={() => window.history.back()}
								className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-white border border-slate-200 shadow hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
							>
								Volver
							</button>

							<button
								onClick={() => (window.location.href = "/admin/dashboard")}
								className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:brightness-95 transition transform hover:-translate-y-0.5 cursor-pointer"
							>
								Ir al dashboard
							</button>
						</div>

						<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
								<h4 className="font-semibold text-slate-800 mb-2">
									¿Por qué veo esto?
								</h4>
								<p className="text-sm text-slate-600">
									Tu cuenta no tiene el rol necesario para
									acceder al módulo solicitado.
								</p>
							</div>

							<div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
								<h4 className="font-semibold text-slate-800 mb-2">
									Qué puedes hacer
								</h4>
								<p className="text-sm text-slate-600">
									Contacta a un administrador o solicita
									elevación de permisos. Revisa también si
									estás en la organización correcta.
								</p>
							</div>

							<div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
								<h4 className="font-semibold text-slate-800 mb-2">
									Soporte
								</h4>
								<p className="text-sm text-slate-600">
									Envía un correo a{" "}
									<a
										href="mailto:soporte@tusitio.local"
										className="underline"
									>
										soporte@tusitio.local
									</a>{" "}
									indicando el módulo y tu usuario.
								</p>
							</div>
						</section>
					</div>
				</main>

				{/* subtle animated footer pattern */}
				<div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
			</div>
		</>
	);
};

export default Unauthorized;
