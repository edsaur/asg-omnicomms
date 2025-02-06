import styled from "styled-components";
import { useSingleSMS } from "./useSingleSMS";
import { useParams } from "react-router";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useForm } from "react-hook-form";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import { useSMSSend } from "./useSMSSend";
import { Form } from "../../ui/Form";

const Sender = styled.p`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const MessageText = styled.p`
  color: #555;
  font-size: 14px;
`;

export default function SMSReplyer() {
  const { sid } = useParams();

  const { data: message, isLoading, error } = useSingleSMS(sid);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const { mutate: sendSMS, isPending } = useSMSSend({ reset });

  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p>Error loading messages: {error.message}</p>;
  setValue("phoneNumber", message.from);

  function handleSMSSending(data) {
    sendSMS(data);
  }
  return (
    <>
      <Sender>From: {message.from}</Sender>
      <MessageText>Message: {message.body}</MessageText>

      <Form onSubmit={handleSubmit(handleSMSSending)}>
        <FormRow label="Your Reply" error={errors?.smsMessage?.message}>
          <Textarea
            {...register("smsMessage", {
              required: "You need to insert your message!",
            })}
          />
        </FormRow>
        <Button disabled={isPending}>Submit</Button>
      </Form>
    </>
  );
}
