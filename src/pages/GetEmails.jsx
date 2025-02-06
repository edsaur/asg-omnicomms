import styled from "styled-components";
import FetchEmail from "../features/emails/FetchEmail";

const StyledEmails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export default function GetEmails() {
  return (
    <StyledEmails>
      <FetchEmail />
    </StyledEmails>
  );
}
