import React from 'react'

export default function NotFound() {
    return (
        <div className="min-h-screen  flex flex-col items-center justify-center p-4 text-[#002f59] overflow-hidden relative">

            {/* Contenido principal */}
            <div className="relative z-10 text-center max-w-2xl">
                <div className="text-9xl font-bold mb-4 flex justify-center">
                    <span className="text-[#002f59] transform rotate-12 inline-block">4</span>
                    <span className="text-[#002f59] transform -rotate-12 inline-block mx-2">0</span>
                    <span className="text-[#002f59] transform rotate-12 inline-block">4</span>
                </div>

                <h1 className="text-4xl font-bold mb-6">¡Ups! Página no encontrada</h1>

                <p className="text-xl mb-8 opacity-90 text-black ">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>


                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center grid grid-cols-1 sm:grid-cols-2">
                    <button
                        onClick={() => window.history.back()}
                        className="cursor-pointer px-6 py-3 bg-[#002f59] text-white font-semibold rounded-lg shadow-lg hover:bg-[#002f59] transition-all transform hover:-translate-y-1 flex items-center justify-center"
                    >
                        <svg className=" w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Volver atrás
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="cursor-pointer  px-6 py-3 bg-[#002f59] border-2 border-white text-white font-semibold rounded-lg shadow-lg hover:bg-[#002f59] hover:text-white transition-all transform hover:-translate-y-1 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    )
}