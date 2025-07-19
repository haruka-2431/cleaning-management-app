import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode; //JSX.Elementに変更したい
}

//ロール権限に基づくアクセス制御
const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { userRole } = useAuth();
  const location = useLocation();

  if(!allowedRoles.includes(userRole)){
    return <Navigate to="/manager-select" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;