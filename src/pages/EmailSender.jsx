import styled from "styled-components";
import SendEmail from "../features/emails/SendEmail";

const StyledEmailSender = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;

export default function EmailSender() {
  return (
    <StyledEmailSender>
      <SendEmail />
    </StyledEmailSender>
  );
}
