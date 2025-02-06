import { useQuery } from "@tanstack/react-query"
import { fetchIndividualEmail } from "../../api/apiEmail";

export const useFetchIndividualEmail = ({id}) => {
    const {data: email, isLoading, error} = useQuery({
        queryFn: () => fetchIndividualEmail(id),
        queryKey: ['email', id],
        enabled: !!id
    });

    return {email, isLoading, error};
}