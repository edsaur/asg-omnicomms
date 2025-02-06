import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "../../api/apiUsers";

export const useSignup = () => {
  return useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      alert("Sign-up successfully");
    },
    onError: (err) => {
      alert(err.message);
    },
  });
};
