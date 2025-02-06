import styled from "styled-components";
import { Form } from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import FileAttachment from "../../ui/FileAttachment";
import Button from "../../ui/Button";
import { useForm } from "react-hook-form";
import { useSendEmail } from "./useSendEmail";
import { useState } from "react";

const StyledForm = styled(Form)`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 12px;
  text-align: left;
`;

const StyledInput = styled(Input)`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const StyledTextarea = styled(Textarea)`
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
`;

const SendButton = styled(Button)`
  background-color: #007bff;
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 12px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default function SendEmail() {
  const [file, setFile] = useState();

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    handleSubmit,
  } = useForm();

  const { mutate: sendEmail, isPending } = useSendEmail({ reset });

  function handleEmailSubmit(data) {
    sendEmail({...data, attachment: file});
  }

  return (
    <StyledForm onSubmit={handleSubmit(handleEmailSubmit)}>
      <Title>New Message</Title>
      <FormRow label="To" error={errors?.to?.message}>
        <StyledInput
          type="text"
          placeholder="Recipient's email"
          {...register("to", {
            required: "This is a required part",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Write a valid email!",
            },
          })}
        />
      </FormRow>

      <FormRow label="Subject">
        <StyledInput
          type="text"
          placeholder="Subject"
          {...register("subject")}
        />
      </FormRow>

      <FormRow label="Message">
        <StyledTextarea
          placeholder="Write your message here..."
          {...register("message")}
        />
      </FormRow>

      <FileAttachment
        handleFileChange={(e) => setFile(e.target.files[0])} // Set file to state
        file={file}
      />
      <SendButton disabled={isPending}> Send </SendButton>
    </StyledForm>
  );
}
