import { useState } from "react";

export const useAdmin = () => {
    const [createUser, setCreateUser] = useState({
        dni: "",
        nombre: "",
        password: "",
        rol: "",
        estado: "",
        confirmPassword: ""
    });

}