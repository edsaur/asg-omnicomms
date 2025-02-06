import { useMutation } from "@tanstack/react-query"
import { sendEmail } from "../../api/apiEmail"

export const useSendEmail = ({reset}) => {
    return useMutation({
        mutationFn: sendEmail,
        onSuccess: () => {
            alert("Email sent successfully!");
            // reset();
        }
    })
}