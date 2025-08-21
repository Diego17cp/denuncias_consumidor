import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "../utils";

const PRIMARY_COLOR = "#2E8acb";
const SECONDARY_COLOR = "#002F59";
const BLACK = "#000000";

export const generarDenunciaPDF = (formData) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	try {
		const logoPath = "/logo-gestion.png";

		const logoWidth = 26;
		const logoHeight = 16;
		const logoX = 10;
		const logoY = 5;

		doc.addImage(logoPath, "JPEG", logoX, logoY, logoWidth, logoHeight);
	} catch (error) {
		console.error("Error al cargar el logo:", error);
	}

	const today = new Date();
	const formattedDate = formatDate(today);

	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);

	doc.setTextColor(BLACK);
	doc.text("SISTEMA DE DENUNCIAS - Consumidor", pageWidth / 2, 20, {
		align: "center",
	});
	doc.text(
		"MUNICIPALIDAD DISTRITAL DE JOSÉ LEONARDO ORTIZ",
		pageWidth / 2,
		30,
		{ align: "center" }
	);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(12);
	doc.setTextColor(100);
	doc.text(`Fecha de emisión: ${formattedDate}`, pageWidth - 20, 40, {
		align: "right",
	});

	doc.setDrawColor(SECONDARY_COLOR);
	doc.setLineWidth(0.5);
	doc.line(14, 45, pageWidth - 14, 45);

	doc.setFont("helvetica", "bold");
	doc.setFontSize(14);
	doc.setTextColor(BLACK);
	doc.text("CÓDIGO DE SEGUIMIENTO", 14, 55);

	doc.setFont("helvetica", "bold");
	doc.setTextColor(PRIMARY_COLOR);
	doc.text(formData.tracking_code || "No disponible", 80, 55);

	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(BLACK);
	doc.text("INFORMACIÓN DE LA DENUNCIA", 14, 70);

	const denunciaDetails = [
		["Fecha del incidente", formData.fecha_incidente || "No especfícada"],
		[
			"Tipo de denuncia",
			formData.es_anonimo ? "Anónima" : "Con datos personales",
		],
		["Lugar del incidente", formData.lugar || "No especificado"],
	];

	autoTable(doc, {
		startY: 75,
		head: [["Campo", "Detalle"]],
		body: denunciaDetails,
		theme: "striped",
		headStyles: {
			fillColor: PRIMARY_COLOR,
			textColor: 255,
		},
	});

	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(BLACK);
	doc.text("DESCRIPCIÓN DE LOS HECHOS", 14, doc.lastAutoTable.finalY + 15);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(60, 60, 60);

	const splitDescription = doc.splitTextToSize(
		formData.descripcion,
		pageWidth - 30
	);
	doc.text(splitDescription, 14, doc.lastAutoTable.finalY + 25);

	let yPosition =
		doc.lastAutoTable.finalY + 25 + splitDescription.length * 5 + 10;

	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(BLACK);
	doc.text("DATOS DEL DENUNCIADO", 14, yPosition);

	const denunciadoDetails = [
		["Tipo de documento", formData.denunciado.tipo_documento.toUpperCase()],
		["Número de documento", formData.denunciado.numero_documento],
		[
			"Nombre / Razón Social",
			formData.denunciado.nombre ||
				formData.denunciado.razon_social ||
				"No disponible",
		],
		["Cargo", formData.denunciado.cargo || "No disponible"],
        ["Dirección", formData.denunciado.domicilio || "No disponible"]
	];

	if (formData.denunciado.tipo_documento === "ruc") {
		denunciadoDetails.push([
			"Representante legal",
			formData.denunciado.representante_legal || "No disponible",
		]);
	}

	autoTable(doc, {
		startY: yPosition + 5,
		head: [["Campo", "Detalle"]],
		body: denunciadoDetails,
		theme: "striped",
		headStyles: {
			fillColor: PRIMARY_COLOR,
			textColor: 255,
		},
	});

	if (!formData.es_anonimo && formData.denunciante) {
		yPosition = doc.lastAutoTable.finalY + 15;

		doc.setFont("helvetica", "bold");
		doc.setFontSize(12);
		doc.setTextColor(BLACK);
		doc.text("DATOS DEL DENUNCIANTE", 14, yPosition);

		const denuncianteDetails = [
			[
				"Tipo de documento",
				formData.denunciante.tipo_documento.toUpperCase(),
			],
			["Número de documento", formData.denunciante.numero_documento],
			["Nombre completo", formData.denunciante.nombres],
			[
				"Sexo",
				formData.denunciante.sexo
					? formData.denunciante.sexo === "M"
						? "Masculino"
						: "Femenino"
					: "No especificado",
			],
			["Email", formData.denunciante.email || "No especificado"],
			["Teléfono", formData.denunciante.telefono || "No especificado"],
            ["Domicilio", formData.denunciante.domicilio || "No especificado"]
		];

		autoTable(doc, {
			startY: yPosition + 5,
			head: [["Campo", "Detalle"]],
			body: denuncianteDetails,
			theme: "striped",
			headStyles: {
				fillColor: PRIMARY_COLOR,
				textColor: 255,
			},
		});
	}

	const finalY = doc.lastAutoTable
        ? doc.lastAutoTable.finalY + 10
        : yPosition + 40;

    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20;
    const textHeight = 10; 
    const minTopMargin = 5;
    const preferredTopMargin = 15;
    
    const availableSpace = pageHeight - finalY - bottomMargin;
    const requiredSpaceMin = textHeight + minTopMargin;
    const requiredSpacePreferred = textHeight + preferredTopMargin;
    
    let textStartY;
    
    if (availableSpace >= requiredSpacePreferred) textStartY = finalY + preferredTopMargin;
    else if (availableSpace >= requiredSpaceMin) textStartY = finalY + minTopMargin;
    else {
        const calculatedMargin = Math.max(2, availableSpace - textHeight);
        textStartY = finalY + calculatedMargin;
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
        "Este documento es una constancia de la denuncia presentada y no constituye",
        pageWidth / 2,
        textStartY,
        { align: "center" }
    );
    doc.text(
        "una admisión o validación de los hechos denunciados.",
        pageWidth / 2,
        textStartY + 5,
        { align: "center" }
    );

	doc.save(`Denuncia-${formData.tracking_code}.pdf`);
};
