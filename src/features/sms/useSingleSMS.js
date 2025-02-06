import { useQuery } from "@tanstack/react-query";
import { getSingleSMS } from "../../api/apiSMS";

export const useSingleSMS = (sid) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getSingleSMS(sid),
    queryKey: ['single-sms', sid],
    enabled: !!sid,
  });
  return {data, isLoading, error};
};
