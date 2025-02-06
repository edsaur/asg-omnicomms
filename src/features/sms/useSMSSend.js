import { useMutation } from "@tanstack/react-query"
import { sendSMS } from "../../api/apiSMS"

export const useSMSSend = ({reset}) => {
    return useMutation({
        mutationFn: sendSMS,
        onSuccess: () => {
            alert("Your message was sent successfully!");
            reset()
        },
        onError: (error) => {
            alert("There was an error", error);
        }
    })
}