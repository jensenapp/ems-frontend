import { useAuth } from "../store/auth-context"
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {

    const {isAuthenticated}=useAuth();
  

  return (
    isAuthenticated ? <Outlet/> :<Navigate to={"/login"}/>
  )
}
