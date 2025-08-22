import { defineStepper } from "@stepperize/react";
import { FaRegFileAlt, FaUserTimes, FaClipboardCheck } from "react-icons/fa";
import { BsPersonVcardFill } from "react-icons/bs";
import StepDetalles from "../../../components/form/StepDetails";
import StepDatosDenunciado from "../../../components/form/StepDenunciado";
import StepDatosDenunciante from "../../../components/form/StepDenunciante";
import { useDenuncias } from "../../../context/DenunciasContext";
import TrackingCodeScreen from "../../../components/form/StepTracking";
import { motion } from "framer-motion";

export const FormDenuncia = () => {
    const { useStepper, steps } = defineStepper(
        { id: "details", title: "Detalles", icon: <FaRegFileAlt className="text-lg" /> },
        { id: "denounced-data", title: "Denunciado", icon: <FaUserTimes className="text-lg" /> },
        { id: "complainant-data", title: "Denunciante", icon: <BsPersonVcardFill className="text-lg" /> },
        { id: "summary", title: "Resumen", icon: <FaClipboardCheck className="text-lg" /> }
    );

    const stepper = useStepper();
    const {
        isStepDetailsValid,
        isStepDenunciadoValid,
        isStepDenuncianteValid,
        isDenunciaEnviada,
        handleSubmit,
        isSubmitting,
    } = useDenuncias();

    const isStepEnabled = (stepId) => {
        const order = steps.map((s) => s.id);
        const currentIdx = order.indexOf(stepper.current.id);
        const stepIdx = order.indexOf(stepId);

        if (stepIdx < currentIdx) return true;
        if (stepIdx === currentIdx) return true;
        if (stepId === "denounced-data") return isStepDetailsValid;
        if (stepId === "complainant-data") return isStepDetailsValid && isStepDenunciadoValid;
        if (stepId === "summary") return isDenunciaEnviada; // Solo habilitar si la denuncia fue enviada
        return false;
    };

    const handleSubmitAndNext = async () => {
        if (!isStepDenuncianteValid) return
        const success = await handleSubmit()
        if (success) stepper.next()
    }

    return (
        <div className="mx-auto max-w-4xl mt-8">
            {/* Stepper */}
            <div className="p-4 mb-8">
                <div className="grid grid-cols-4 gap-4">
                    {steps.map((step, index) => {
                        const isActive = stepper.current.id === step.id;
                        const isCompleted = steps.findIndex((s) => s.id === stepper.current.id) > index;
                        const enabled = isStepEnabled(step.id);

                        return (
                            <motion.div
                                key={step.id}
                                className={`
                                    relative flex flex-col items-center
                                    ${enabled ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
                                `}
                                whileHover={enabled ? { scale: 1.02 } : {}}
                                onClick={() => enabled && stepper.goTo(step.id)}
                            >
                                {/* Línea conectora */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                                            absolute top-7 left-1/2 w-full h-[2px]
                                            ${isCompleted ? "bg-muni-primary" : "bg-gray-200"}
                                        `}
                                    />
                                )}

                                {/* Círculo del paso */}
                                <div
                                    className={`
                                        w-16 h-16 rounded-full flex items-center justify-center
                                        relative z-10 transition-all duration-300
                                        ${
                                            isActive
                                                ? "bg-muni-primary text-white ring-4 ring-blue-100"
                                                : isCompleted
                                                ? "bg-muni-primary text-white"
                                                : "bg-white text-gray-400 border-2 border-gray-200"
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <motion.svg
                                            className="w-8 h-8"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </motion.svg>
                                    ) : (
                                        <div className="text-2xl">{step.icon}</div>
                                    )}
                                </div>

                                {/* Título del paso */}
                                <motion.div
                                    className="mt-4 text-center"
                                    animate={{
                                        scale: isActive ? 1.05 : 1,
                                        fontWeight: isActive ? "600" : "normal",
                                    }}
                                >
                                    <h3
                                        className={`
                                            text-sm font-medium mb-1
                                            ${isActive ? "text-muni-primary" : "text-gray-600"}
                                        `}
                                    >
                                        {step.title}
                                    </h3>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Contenido del formulario */}
            <motion.div
                key={stepper.current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className=""
            >
                {stepper.switch({
                    details: () => (
                        <StepDetalles
                            onNext={() => isStepDetailsValid && stepper.next()}
                        />
                    ),
                    "denounced-data": () => (
                        <StepDatosDenunciado
                            onPrev={stepper.prev}
                            onNext={() => isStepDenunciadoValid && stepper.next()}
                        />
                    ),
                    "complainant-data": () => (
                        <StepDatosDenunciante
                            onPrev={stepper.prev}
                            onNext={handleSubmitAndNext}
                            isSubmitting={isSubmitting}
                        />
                    ),
                    summary: () => (
                        <TrackingCodeScreen />
                    ),
                })}
            </motion.div>
        </div>
    );
};