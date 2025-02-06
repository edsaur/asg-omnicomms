import { useQuery } from "@tanstack/react-query"
import { getUsername } from "../../api/apiUsers"

export const useUsername = (uid) => {

    const {data: username, isLoading} = useQuery({
        queryKey: ['uid', uid],
        queryFn: () => getUsername(uid)
    });

    return {username, isLoading}
}