import styled from "styled-components";
import SMSInbox from "../features/sms/SMSInbox";

const StyledSMSInbox = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default function SMSMessage() {
  return (
    <StyledSMSInbox>
      <SMSInbox />
    </StyledSMSInbox>
  );
}
