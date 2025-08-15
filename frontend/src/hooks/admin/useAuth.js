import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const useAuth = () => {
    if (!AuthContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return useContext(AuthContext);
}