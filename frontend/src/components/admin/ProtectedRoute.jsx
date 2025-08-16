import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/admin/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader } from "dialca-ui";

export const ProtectedRoute = ({
    children, 
    allowedRoles
}) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation()
    const navigate = useNavigate()
    const isAdminRoute = location.pathname.startsWith('/admin');

    useEffect(() => {
        if (isAdminRoute && !loading && !isAuthenticated && user && user.state==="0") {
            toast.error('Tu cuenta está inactiva. Comunícate con el administrador.')
            navigate('/admin/login')
        }
    }, [isAuthenticated, loading, user, isAdminRoute, navigate]);

    if (loading) {
        return (
            <div className="flex flex-justify-center items-center min-h-screen">
                <Loader size={10} />
            </div>
        )
    }
    if (isAdminRoute && !isAuthenticated) return (<Navigate to="/admin/login" state={{ from: location }} replace />)
    if (isAuthenticated && user && !allowedRoles.includes(user.rol)) {
        return <Navigate to='/unauthorized' replace />
    }
    return <>{children}</>;
}