import { useNavigate } from "react-router";
import { useUser } from "../features/authentication/useUser"
import { useEffect } from "react";

export default function ProtectedRoute({children}) {
    const {isLoading, isAuthenticated} = useUser();
    const navigate = useNavigate();
    // to check if user is logged in
    
    useEffect(() => {
        if(!isAuthenticated && !isLoading) navigate('/login')
    } ,[navigate, isAuthenticated, isLoading]);
    if(isLoading) return null;

    // redirect to login. 
    if(isAuthenticated) return children
       
}
