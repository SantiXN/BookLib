import { Navigate, useLocation } from "react-router-dom";
import AuthMenu from "../../component/AuthMenu/AuthMenu"
import { useAuth } from "../../context/AuthContext";

const AuthPage = () => {
    const {isAuthenticated} = useAuth();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    if (isAuthenticated) {
        return <Navigate to={from} />;
    }

    return (
        <div>
            <AuthMenu />
        </div>
    )
}

export default AuthPage;