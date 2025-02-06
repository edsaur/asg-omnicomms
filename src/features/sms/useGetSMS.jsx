import { useQuery } from "@tanstack/react-query"
import { getSMS } from "../../api/apiSMS"

export const useGetSMS = () => {
    const {data: smsMessages, error, isLoading} = useQuery({
        queryFn: getSMS,
        queryKey: ["smsMessages"]
    })

    return {smsMessages, error, isLoading}
}