import { useForm } from "react-hook-form";
import { Form } from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import styled from "styled-components";
import { useSignup } from "./useSIgnup";
import { useNavigate } from "react-router";

const StyledHeading = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 1.5rem;
`;

export default function UserSignup() {
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
      } = useForm();
    
    // include mutation
    const {mutate: signUpUser, isLoading} = useSignup();
    // handle the submitted data
      const handleRegistration = (data) => {
        signUpUser(data);
        // reset();
      };

    return (
        <Form onSubmit={handleSubmit(handleRegistration)}>
        <StyledHeading>Signup</StyledHeading>

        <FormRow label="Username" error={errors?.username?.message}>
          <Input
            type="text"
            {...register("username", {
              required: "This is a required part",
              minLength: {
                value: 5,
                message: "Minimum length is 5 characters"
              }
            })}
          />
        </FormRow>

        <FormRow label="Email" error={errors?.email?.message}>
          <Input
            type="text"
            {...register("email", {
              required: "This is a required part",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Write a valid email!",
              },
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

        <Button disabled={isLoading}>Sign-up</Button>
      </Form>    
    )
}
