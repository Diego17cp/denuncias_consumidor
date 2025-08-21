import React, { useState } from 'react';
import { Users, AlertTriangle, Clock, Activity } from 'lucide-react';
import { useNavigate } from "react-router";


const useAuth = () => ({
    user: { nombre: "Diego Castro" },
    logout: () => console.log("Logout")
});

export function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    // Función para redirigir a los diferentes módulos
    const redirectToModule = (module) => {
        navigate(`/admin/${module}`);
    };

    const moduleCards = [
        {
            id: 'usuarios',
            title: 'Administrar Usuarios',
            description: 'Gestionar usuarios del sistema',
            icon: Users,
            gradient: 'from-blue-500 to-indigo-600',
            stats: '1,248 usuarios',
            trend: '+12%',
            bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-100'
        },
        {
            id: 'denuncias',
            title: 'Administrar Denuncias',
            description: 'Revisar y gestionar denuncias',
            icon: AlertTriangle,
            gradient: 'from-red-500 to-pink-600',
            stats: '24 pendientes',
            trend: '-8%',
            bgPattern: 'bg-gradient-to-br from-red-50 to-pink-100'
        },
        {
            id: 'historial',
            title: 'Historial de Administradores',
            description: 'Registro de actividades administrativas',
            icon: Clock,
            gradient: 'from-green-500 to-emerald-600',
            stats: '18 acciones hoy',
            trend: '+5%',
            bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-100'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Activity className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Panel de Administración
                                </h1>
                                {user && (
                                    <div className="flex items-center mt-1 space-x-2">
                                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <p className="text-sm font-medium text-gray-700">¡Bienvenido, {user.nombre}!</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Administrador
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Botón de cerrar sesion */}
                            <button
                                onClick={logout}
                                className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                <span className="relative z-10">Cerrar Sesión</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>


            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Sección de módulos */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Módulos Principales</h2>
                        <div className="flex items-center space-x-2">
                            <select
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todos los módulos</option>
                                <option value="active">Módulos activos</option>
                                <option value="priority">Alta prioridad</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {moduleCards.map((module, index) => (
                            <div
                                key={module.id}
                                className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${module.bgPattern}`}
                                onClick={() => redirectToModule(module.id)}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Gradiente */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                {/* Contenido de la card */}
                                <div className="relative p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${module.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <module.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-medium text-gray-500">{module.stats}</span>
                                            <span className={`text-xs font-bold ${module.trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                {module.trend}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                                            {module.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>
                                            Acceder al módulo
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </div>
                                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        </button>
                                    </div>
                                </div>
                                {/* Efecto al hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}