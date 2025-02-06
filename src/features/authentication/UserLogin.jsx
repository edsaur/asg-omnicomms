import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../../ui/Button";
import { Form } from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useLogin } from "./useLogin";

const StyledHeading = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 1.5rem;
`;

export default function UserLogin() {
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
      } = useForm();
    
    // include mutation
    const {mutate: loginUser, isPending} = useLogin({reset, navigate});
    // handle the submitted data
      const handleRegistration = (data) => {
        loginUser(data);
      };

    return (
        <Form onSubmit={handleSubmit(handleRegistration)}>
        <StyledHeading>Login</StyledHeading>

        <FormRow label="Username" error={errors?.username?.message}>
          <Input
            type="text"
            {...register("username", {
              required: "This is a required part",
            })}
          />
        </FormRow>

        <FormRow label="Password" error={errors?.password?.message}>
          <Input
            type="password"
            {...register("password", {
              required: "This is a required part",
              minLength: {
                value: 8,
                message: "The password must be 8 or more characters!"
              }
            })}
          />
        </FormRow>

        <Button disabled={isPending}>Sign-in</Button>
      </Form>    
    )
}
