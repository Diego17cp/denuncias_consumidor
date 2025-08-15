import { useEffect, useState } from "react";

export function useTrackingCode() {
    const [trackingCode, setTrackingCode] = useState("");

    useEffect(() => {
        // Verifica si ya existe un código en localStorage
        let code = localStorage.getItem("trackingCode");
        if (!code) {
            // Genera un código único de 10 caracteres (letras y números)
            code = Math.random().toString(36).substring(2, 12).toUpperCase();
            localStorage.setItem("trackingCode", code);
        }
        setTrackingCode(code);
    }, []);

    return { trackingCode };
}