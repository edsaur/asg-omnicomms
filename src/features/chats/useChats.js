import { useMutation } from "@tanstack/react-query"
import { insertChat } from "../../api/apiChats"

export const useChats = () => {
    return useMutation({
        mutationFn: insertChat,
    })
}