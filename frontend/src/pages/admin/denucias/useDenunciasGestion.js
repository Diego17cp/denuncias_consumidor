import { useState } from "react"

export function useDenunciasGestion() {
    const [activeTab, setActiveTab] = useState("disponibles")
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos")
    const [selectedDenuncia, setSelectedDenuncia] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [newStatus, setNewStatus] = useState("")
    const [searchType, setSearchType] = useState("DNI")
    const [searchDocument, setSearchDocument] = useState("")
    const [searchName, setSearchName] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [expandedFilters, setExpandedFilters] = useState(false)

    const [denunciasDisponibles, setDenunciasDisponibles] = useState([
        {
            id: 1,
            denunciado: "Juan Carlos Pérez",
            fecha: "2025-08-20",
            descripcion: "Agresión física durante una discusión en el establecimiento",
            lugar: "Centro Comercial Plaza Norte - Piso 2",
            denunciante: "María González",
            prioridad: "alta",
        },
        {
            id: 2,
            denunciado: "Ana Torres Vega",
            fecha: "2025-08-19",
            descripcion: "Acoso laboral y discriminación por género",
            lugar: "Oficinas administrativas - Edificio Central",
            denunciante: "Roberto Silva",
            prioridad: "media",
        },
        {
            id: 3,
            denunciado: "Luis Alberto Morales",
            fecha: "2025-08-18",
            descripcion: "Robo de pertenencias personales en vestuario",
            lugar: "Vestuarios del gimnasio municipal",
            denunciante: "Anónimo",
            prioridad: "baja",
        },
    ])

    const [denunciasRecibidas, setDenunciasRecibidas] = useState([
        {
            id: "DEN-2025-001",
            motivo: "Agresión verbal y amenazas",
            contra: "Pedro Torres",
            fecha: "2025-08-15",
            estado: "Pendiente",
            denunciante: "Carmen López",
            denuncianteDni: "12345678",
            denunciadoDni: "87654321",
            detalleIncidente: "El denunciado profirió insultos y amenazas durante una reunión de trabajo",
            fechaIncidente: "2025-08-14",
            lugarIncidente: "Sala de reuniones - Piso 3",
            historial: [
                { fecha: "2025-08-15 09:00", estado: "Registrada", comentario: "Denuncia recibida y registrada en el sistema" },
            ],
            comentarios: "Se ha iniciado la investigación preliminar. Pendiente entrevista con testigos.",
            evidencias: ["audio_reunion.mp3", "testimonio_testigo1.pdf"],
        },
        {
            id: "DEN-2025-002",
            motivo: "Discriminación por edad",
            contra: "Sandra Ruiz",
            fecha: "2025-08-12",
            estado: "Pendiente",
            denunciante: "Miguel Vargas",
            denuncianteDni: "11223344",
            denunciadoDni: "44332211",
            detalleIncidente: "Comentarios discriminatorios sobre la edad del denunciante",
            fechaIncidente: "2025-08-10",
            lugarIncidente: "Departamento de Recursos Humanos",
            historial: [
                { fecha: "2025-08-12 10:15", estado: "Registrada", comentario: "Denuncia recibida" },
                { fecha: "2025-08-12 16:45", estado: "Pendiente", comentario: "En espera de asignación de investigador" },
            ],
            comentarios: "Pendiente de asignación a investigador especializado.",
            evidencias: ["email_discriminatorio.pdf"],
        },
    ])

    const estados = [
        { value: "registrada", label: "Registrada", color: "emerald" },
        { value: "pendiente", label: "Pendiente", color: "amber" },
        { value: "cerrada", label: "Cerrada", color: "slate" },
        { value: "archivada", label: "Archivada", color: "red" },
    ]

    const filteredDenuncias = denunciasRecibidas.filter((denuncia) => {
        const matchesSearch =
            denuncia.contra.toLowerCase().includes(searchTerm.toLowerCase()) ||
            denuncia.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            denuncia.motivo.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "todos" || denuncia.estado.toLowerCase().replace(" ", "") === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status) => {
        const normalizedStatus = status.toLowerCase().replace(" ", "")
        const statusObj = estados.find(
            (s) => s.value === normalizedStatus || s.label.toLowerCase().replace(" ", "") === normalizedStatus,
        )
        return statusObj ? statusObj.color : "slate"
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "alta":
                return "red"
            case "media":
                return "amber"
            case "baja":
                return "emerald"
            default:
                return "slate"
        }
    }

    const getStatusStyles = (status) => {
        const color = getStatusColor(status)
        const colorMap = {
            emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
            amber: "bg-amber-50 text-amber-700 border-amber-200",
            blue: "bg-blue-50 text-blue-700 border-blue-200",
            slate: "bg-slate-50 text-slate-700 border-slate-200",
            red: "bg-red-50 text-red-700 border-red-200",
        }
        return colorMap[color] || colorMap.slate
    }

    const getPriorityStyles = (priority) => {
        const color = getPriorityColor(priority)
        const colorMap = {
            red: "bg-red-50 text-red-700 border-red-200",
            amber: "bg-amber-50 text-amber-700 border-amber-200",
            emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
            slate: "bg-slate-50 text-slate-700 border-slate-200",
        }
        return colorMap[color] || colorMap.slate
    }

    const recibirDenuncia = (denuncia) => {
        const nuevaDenuncia = {
            id: `DEN-2025-${String(denunciasRecibidas.length + 1).padStart(3, "0")}`,
            motivo: denuncia.descripcion,
            contra: denuncia.denunciado,
            fecha: new Date().toISOString().split("T")[0],
            estado: "Registrada",
            denunciante: denuncia.denunciante,
            denuncianteDni: "12345678",
            denunciadoDni: "87654321",
            detalleIncidente: denuncia.descripcion,
            fechaIncidente: denuncia.fecha,
            lugarIncidente: denuncia.lugar,
            historial: [
                {
                    fecha: new Date().toLocaleString(),
                    estado: "Registrada",
                    comentario: "Denuncia recibida y registrada en el sistema",
                },
            ],
            comentarios: "Denuncia recién recibida, pendiente de revisión inicial.",
            evidencias: [],
        }

        setDenunciasRecibidas([...denunciasRecibidas, nuevaDenuncia])
        setDenunciasDisponibles(denunciasDisponibles.filter((d) => d.id !== denuncia.id))
        alert("Denuncia recibida exitosamente")
    }

    const mostrarDetalles = (denuncia) => {
        setSelectedDenuncia(denuncia)
        setNewComment(denuncia.comentarios || "")
        setNewStatus(denuncia.estado)
        setShowDetails(true)
    }

    const actualizarDenuncia = () => {
        if (!selectedDenuncia) return

        const nuevoHistorial = [...selectedDenuncia.historial]
        if (newStatus !== selectedDenuncia.estado) {
            nuevoHistorial.push({
                fecha: new Date().toLocaleString(),
                estado: newStatus,
                comentario: newComment,
            })
        }

        const denunciaActualizada = {
            ...selectedDenuncia,
            estado: newStatus,
            comentarios: newComment,
            historial: nuevoHistorial,
        }

        setDenunciasRecibidas(denunciasRecibidas.map((d) => (d.id === selectedDenuncia.id ? denunciaActualizada : d)))
        setSelectedDenuncia(denunciaActualizada) // No cerrar el modal, solo actualizar
        alert("Denuncia actualizada exitosamente")
    }

    const buscarDenuncias = () => {
        const resultados = denunciasRecibidas.filter((denuncia) => {
            const matchDocument = searchDocument ? denuncia.denunciadoDni.includes(searchDocument) : true
            const matchName = searchName ? denuncia.contra.toLowerCase().includes(searchName.toLowerCase()) : true
            return matchDocument && matchName
        })

        setSearchResults(resultados)
    }

    const limpiarBusqueda = () => {
        setSearchDocument("")
        setSearchName("")
        setSearchResults([])
    }

    function getStatistics() {
        const total = denunciasRecibidas.length
        const pendientes = denunciasRecibidas.filter((d) => d.estado === "Pendiente").length
        const cerradas = denunciasRecibidas.filter((d) => d.estado === "Cerrada").length

        return { total, pendientes, cerradas }
    }
    const stats = getStatistics()

    return {
        // Estados
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        selectedDenuncia,
        setSelectedDenuncia,
        showDetails,
        setShowDetails,
        newComment,
        setNewComment,
        newStatus,
        setNewStatus,
        searchType,
        setSearchType,
        searchDocument,
        setSearchDocument,
        searchName,
        setSearchName,
        searchResults,
        setSearchResults,
        expandedFilters,
        setExpandedFilters,
        denunciasDisponibles,
        setDenunciasDisponibles,
        denunciasRecibidas,
        setDenunciasRecibidas,
        estados,
        filteredDenuncias,
        // Funciones
        getStatusStyles,
        getPriorityStyles,
        recibirDenuncia,
        mostrarDetalles,
        actualizarDenuncia,
        buscarDenuncias,
        limpiarBusqueda,
        stats,
    }
}