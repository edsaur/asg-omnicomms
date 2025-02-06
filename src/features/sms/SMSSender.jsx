import { useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import Button from "../../ui/Button";
import { Form } from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import { useSMSSend } from "./useSMSSend";

export default function SMSSender() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {mutate: sendSMS, isPending} = useSMSSend({reset});

  function handleSMSSend(data) {
    sendSMS(data);
  }
  return (
    <Form onSubmit={handleSubmit(handleSMSSend)}>
      <FormRow label="Send To (only put US Number)" error={errors?.phoneNumber?.message}>
        <Input
          {...register("phoneNumber", {
            required: "This is required",
            pattern: {
              value: /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
              message: "Invalid US phone number",
            },
          })}
        />
      </FormRow>

      <FormRow label="Your Message" error={errors?.smsMessage?.message}>
        <Textarea {...register("smsMessage", {required: "You need to insert your message!"})}/>
      </FormRow>
      <Button disabled={isPending}>Submit</Button>
    </Form>
  );
}
