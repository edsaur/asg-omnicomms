import { useMutation } from "@tanstack/react-query";
import { outboundCalls } from "../../api/apiCalls";

export function useOutboundCall({ setCallStatus, setIsModalOpen }) {
  return useMutation({
    mutationFn: outboundCalls,
    onSuccess: () => {
      // Handle the success - get call SID and change status
      setCallStatus("Calling...");
      setIsModalOpen(true); // Open modal on successful call initiation
    },
    onError: (error) => {
      setCallStatus("Error");
      alert(error.message);
    },
  });
}
