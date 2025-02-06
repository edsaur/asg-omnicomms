import styled from "styled-components";
import SMSReplyer from "../features/sms/SMSReplyer";

const StyledReplyer = styled.div`
width: 80%;
  margin: 20px auto; /* Center the component */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

export default function SMSReply() {
  return (
    <StyledReplyer>
      <SMSReplyer />
    </StyledReplyer>
  );
}
