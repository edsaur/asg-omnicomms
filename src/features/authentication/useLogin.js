import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/apiUsers";

export const useLogin = ({reset, navigate}) => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      alert("success");
      reset();
      navigate('/');
    },
    onError: (err) => {
      alert(err.message);
    },
  });
};
