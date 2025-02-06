import { useQuery } from "@tanstack/react-query"
import { getUser } from "../../api/apiUsers"

export const useUser = () => {
    const {data: user, isLoading, error} = useQuery({
        queryKey: ['user'],
        queryFn: getUser
    })

    return {user, isLoading, isAuthenticated: user?.role === 'authenticated'};
}