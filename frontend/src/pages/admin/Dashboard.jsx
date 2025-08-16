import { useAuth } from "../../hooks/admin/useAuth";

export const Dashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div>
            <h1>Dashboard</h1>
            {user && (
                <div>
                    <h2>Welcome, {user.nombre}!</h2>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
    );
};
