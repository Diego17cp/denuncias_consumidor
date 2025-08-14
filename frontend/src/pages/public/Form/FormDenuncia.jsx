import { defineStepper } from "@stepperize/react";
import { FaRegFileAlt, FaUserTimes, FaClipboardCheck } from "react-icons/fa";
import { BsPersonVcardFill } from "react-icons/bs";
import { DropZone, InputField } from "dialca-ui";
import StepDetalles from "../../../components/form/StepDetails";
import StepDatosDenunciado from "../../../components/form/StepDenunciado";
import StepDatosDenunciante from "../../../components/form/StepDenunciante";

export const FormDenuncia = () => {
	const { useStepper, steps } = defineStepper(
		{ id: "details", title: "Detalles", icon: <FaRegFileAlt /> },
		{ id: "denounced-data", title: "Denunciado", icon: <FaUserTimes /> },
		{
			id: "complainant-data",
			title: "Denunciante",
			icon: <BsPersonVcardFill />,
		},
		{ id: "summary", title: "Resumen", icon: <FaClipboardCheck /> }
	);
	const stepper = useStepper();
	return (
		<div className="mx-auto p-2 md:p-6! max-w-4xl bg-white rounded-md mt-5">
            <form>
                {/* STEPPER */}
                {/* Hacer esto un componente */}
                {/* Definir estados completados para cada step, la libreria no trae esta funcionalidad */}
                <div className="sticky top-0 z-10 w-full">
                    <div className="flex items-end gap-0 w-full">
                        {steps.map((step) => (
                            
                            <div
                                key={step.id}
                                className={`
                                    flex-1 flex flex-col items-center py-4
                                    ${
                                        stepper.current.id === step.id
                                            ? "bg-muni-secondary hover:bg-muni-secondary/85"
                                            : "bg-gray-200 hover:bg-gray-300"
                                    }
                                    transition-colors duration-300
                                    cursor-pointer
                                `}
                                onClick={() => {
                                    /*if (validateSteps())*/ stepper.goTo(step.id);
                                }}
                            >
                                <div
                                    className={`
                                        size-12 flex items-center justify-center rounded-full shadow
                                        ${
                                            stepper.current.id === step.id
                                                ? "bg-white text-muni-primary border-4 border-muni-primary"
                                                : "bg-gray-100 text-gray-400 border-4 border-gray-200"
                                        }
                                        text-2xl mb-2
                                    `}
                                >
                                    {step.icon}
                                </div>
                                <div
                                    className={`
                                        text-center text-sm font-semibold
                                        ${
                                            stepper.current.id === step.id
                                                ? "text-white"
                                                : "text-gray-500"
                                        }
                                        mt-1
                                    `}
                                >
                                    {step.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contenido de cada step, solo cambia  */}
                <div className="flex flex-col gap-6 bg-white p-3"> {/* Se supone que el fondo es #002f59 pero te lo mandé asi y me dijiste q lo ponga blanco */}
                        {stepper.switch({
                            "details": () => (
                                <div className="p-4">
                                    < StepDetalles />
                                </div>
                            ),
                            "denounced-data": () => (
                                <div className="p-4">
                                    < StepDatosDenunciado />
                                </div>
                            ),
                            "complainant-data": () => (
                                <div className="p-4">
                                    < StepDatosDenunciante />
                                </div>
                            ),
                            "summary": () => (
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">Resumen</h2>
                                    <p>Revisa la información antes de enviar la denuncia.</p>
                                </div>
                            ),
                        })}
                </div>
            </form>
		</div>
	);
};
