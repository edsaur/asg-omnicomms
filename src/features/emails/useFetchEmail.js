import { useQuery } from "@tanstack/react-query"
import { fetchEmails } from "../../api/apiEmail"

export const useFetchEmail = () => {
    const {data: emails, isLoading, error} = useQuery({
        queryFn: fetchEmails,
        queryKey: ['emails']
    });

    return {emails, isLoading, error};
}