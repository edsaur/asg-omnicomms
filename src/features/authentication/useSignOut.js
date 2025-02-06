import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { logout } from "../../api/apiUsers";

export const useSignOut = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.cancelQueries();
            navigate('/login', {replace:true})
        }
    })
}