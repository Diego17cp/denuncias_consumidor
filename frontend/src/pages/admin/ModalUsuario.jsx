import React from "react";
import { X, Eye, EyeOff, User, Key, Shield } from "lucide-react";
import { useAdmin } from "../../hooks/admin/usuarios/useAdmin";
import { Loader } from "dialca-ui"

export default function ModalUsuario({
	open,
	modalType,
	selectedUser,
	roles,
	closeModal,
}) {
    const {
        createUser: formData,
		showPassword,
		isCreating,
		handleShowPassword,
		handleInputChange,
		handleCreateUser,
		updatedPassword,
		handlePasswordChange,
		updateUser,
		handleRoleChange,
		updatedRol
	} = useAdmin();

    if (!open) return null;
    
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
			<div
				className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 opacity-100 scale-100"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header del modal */}
				<header className="flex items-center justify-between p-6 border-b border-gray-100">
					<div className="flex items-center">
						<div
							className={`p-2 rounded-lg mr-3 ${
								modalType === "crear"
									? "bg-blue-100 text-blue-600"
									: modalType === "password"
									? "bg-green-100 text-green-600"
									: "bg-purple-100 text-purple-600"
							}`}
						>
							{modalType === "crear" && (
								<User className="h-5 w-5" />
							)}
							{modalType === "password" && (
								<Key className="h-5 w-5" />
							)}
							{modalType === "role" && (
								<Shield className="h-5 w-5" />
							)}
						</div>
						<h3 className="text-xl font-semibold text-gray-900">
							{modalType === "crear" &&
								"Crear Nuevo Administrador"}
							{modalType === "password" && "Cambiar Contraseña"}
							{modalType === "role" && "Cambiar Rol de Usuario"}
						</h3>
					</div>
					<button
						onClick={closeModal}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
						aria-label="Cerrar modal"
					>
						<X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
					</button>
				</header>

				{/* Contenido del modal */}
				<main className="p-6 max-h-[70vh] overflow-y-auto">
					{modalType === "crear" && (
						<form
							onSubmit={handleCreateUser}
							className="space-y-5"
						>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									DNI
								</label>
								<input
									type="text"
									name="dni"
									value={formData.dni}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
									placeholder="Ingrese el DNI"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nombre Completo
								</label>
								<input
									type="text"
									name="nombre"
									value={formData.nombre}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
									placeholder="Nombre completo del usuario"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Contraseña
								</label>
								<div className="relative">
									<input
										type={
											showPassword.password ? "text" : "password"
										}
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
										placeholder="Cree una contraseña segura"
									/>
									<button
										type="button"
										onClick={() => handleShowPassword('password')}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
										aria-label={
											showPassword.password
												? "Ocultar contraseña"
												: "Mostrar contraseña"
										}
									>
										{showPassword.password ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Confirmar Contraseña
								</label>
								<div className="relative">
									<input
										type={
											showPassword.confirmPassword
												? "text"
												: "password"
										}
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
										placeholder="Confirme la contraseña"
									/>
									<button
										type="button"
										onClick={() => handleShowPassword('confirmPassword')}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
										aria-label={
											showPassword.confirmPassword
												? "Ocultar contraseña"
												: "Mostrar contraseña"
										}
									>
										{showPassword.confirmPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Rol
								</label>
								<select
									name="rol"
									value={formData.rol}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 bg-white"
								>
                                    <option value="" disabled>Selecciona un rol</option>
									{roles.map((role) => (
										<option
											key={role.value}
											value={role.value}
										>
											{role.label}
										</option>
									))}
								</select>
							</div>

							<div className="flex space-x-4 pt-2">
								<button
									type="button"
									onClick={closeModal}
									className="cursor-pointer flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
								>
									Cancelar
								</button>
								<button
									type="submit"
                                    disabled={isCreating}
									className="cursor-pointer flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:cursor-not-allowed disabled:to-blue-200 disabled:from-blue-300"
								>
									{isCreating ? <Loader /> : "Crear usuario"}
								</button>
							</div>
						</form>
					)}

					{modalType === "password" && selectedUser && (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								updateUser(selectedUser.dni, "password");
								closeModal();
							}}
							className="space-y-5"
						>
							<div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
								<h4 className="font-medium text-blue-900">
									Usuario: {selectedUser.nombre}
								</h4>
								<p className="text-sm text-blue-700 mt-1">
									DNI: {selectedUser.dni}
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nueva Contraseña
								</label>
								<input
									type="password"
									required
									name="password"
									value={updatedPassword.password}
									onChange={handlePasswordChange}
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									placeholder="Ingrese la nueva contraseña"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Confirmar Nueva Contraseña
								</label>
								<input
									type="password"
									required
									name="confirmPassword"
									value={updatedPassword.confirmPassword}
									onChange={handlePasswordChange}
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									placeholder="Confirme la nueva contraseña"
								/>
							</div>

							<div className="flex space-x-4 pt-2">
								<button
									type="button"
									onClick={closeModal}
									className="cursor-pointer flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="cursor-pointer flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
								>
									Cambiar Contraseña
								</button>
							</div>
						</form>
					)}

					{modalType === "role" && selectedUser && (
						<div className="space-y-5">
							<div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
								<h4 className="font-medium text-purple-900">
									Usuario: {selectedUser.nombre}
								</h4>
								<p className="text-sm text-purple-700 mt-1">
									DNI: {selectedUser.dni}
								</p>
								<p className="text-sm text-purple-700 mt-1">
									Rol actual: {selectedUser.rol}
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nuevo Rol
								</label>
								<select
									value={updatedRol}
									onChange={handleRoleChange}
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
								>
									<option value="" disabled>Selecciona un rol</option>
									{roles.map((role) => (
										<option
											key={role.value}
											value={role.value}
										>
											{role.label}
										</option>
									))}
								</select>
							</div>

							<div className="flex space-x-4 pt-2">
								<button
									onClick={closeModal}
									className="cursor-pointer flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
								>
									Cancelar
								</button>
								<button
									onClick={() => {
										updateUser(selectedUser.dni, "rol");
									}}
									className="cursor-pointer flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
								>
									Guardar Cambios
								</button>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
