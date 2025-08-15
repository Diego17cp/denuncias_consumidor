import { defineStepper } from "@stepperize/react";
import { FaRegFileAlt, FaUserTimes, FaClipboardCheck } from "react-icons/fa";
import { BsPersonVcardFill } from "react-icons/bs";
import { DropZone, InputField } from "dialca-ui";
import StepDetalles from "../../../components/form/StepDetails";
import StepDatosDenunciado from "../../../components/form/StepDenunciado";
import StepDatosDenunciante from "../../../components/form/StepDenunciante";
import { useDenuncias } from "../../../context/DenunciasContext";
import TrackingCodeScreen from "../../../components/form/StepTracking";

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
    const { isStepDetailsValid, isStepDenunciadoValid, isStepDenuncianteValid } =
        useDenuncias();

    // Controla si el paso está habilitado
    const isStepEnabled = (stepId) => {
        const order = steps.map((s) => s.id);
        const currentIdx = order.indexOf(stepper.current.id);
        const stepIdx = order.indexOf(stepId);

        if (stepIdx < currentIdx) return true; // Permite ir atras
        if (stepIdx === currentIdx) return true; // actual

        // Permite avanzar solo si los pasos anteriores están completos
        if (stepId === "denounced-data") return isStepDetailsValid;
        if (stepId === "complainant-data")
            return isStepDetailsValid && isStepDenunciadoValid;
        if (stepId === "summary")
            return (
                isStepDetailsValid && isStepDenunciadoValid && isStepDenuncianteValid
            );
        return false;
    };

    return (
        <div className="mx-auto p-2 md:p-6! max-w-4xl bg-white rounded-md mt-5">
            <form>
                {/* STEPPER */}
                <div className="flex top-0 z-10 w-full">
                    <div className="flex items-end gap-0 w-full">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`
                                    flex-1 flex flex-col items-center py-4
                                    ${stepper.current.id === step.id
                                        ? "bg-muni-secondary hover:bg-muni-secondary/85"
                                        : "bg-gray-200 hover:bg-gray-300"
                                    }
                                    transition-colors duration-300
                                    ${isStepEnabled(step.id)
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed opacity-50"
                                    }
                                `}
                                onClick={() => {
                                    if (isStepEnabled(step.id)) stepper.goTo(step.id);
                                }}
                            >
                                <div
                                    className={`
                                        size-12 flex items-center justify-center rounded-full shadow
                                        ${stepper.current.id === step.id
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
                                        ${stepper.current.id === step.id
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

                {/* Contenido de cada step */}
                <div className="flex flex-col gap-6 bg-white p-3">
                    {stepper.switch({
                        details: () => (
                            <div className="p-4">
                                <StepDetalles
                                    onNext={() => isStepDetailsValid && stepper.next()}
                                />
                            </div>
                        ),
                        "denounced-data": () => (
                            <div className="p-4">
                                <StepDatosDenunciado
                                    onPrev={stepper.prev}
                                    onNext={() => isStepDenunciadoValid && stepper.next()}
                                />
                            </div>
                        ),
                        "complainant-data": () => (
                            <div className="p-4">
                                <StepDatosDenunciante
                                    onPrev={stepper.prev}
                                    onNext={() => isStepDenuncianteValid && stepper.next()}
                                />
                            </div>
                        ),
                        summary: () => (
                            <div className="p-4">
                                < TrackingCodeScreen />
                            </div>
                        ),
                    })}
                </div>
            </form>
        </div>
    );
};
