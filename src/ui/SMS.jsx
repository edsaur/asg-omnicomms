import { Outlet, useNavigate } from "react-router";
import styled from "styled-components";
import Button from "./Button";

const StyledSMSContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 50%;
  margin: 0 auto;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  height: 100vh;
  box-sizing: border-box;
`;

const StyledSMSLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  background-color: #0066cc;
  color: white;
  padding: 12px 18px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #005bb5;
    transform: scale(1.05);
  }

  &:active {
    background-color: #004999;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
`;

export default function SMS() {
  const navigate = useNavigate();
  return (
    <StyledSMSContainer>
      <Title>SMS Dashboard</Title>
      <StyledSMSLinks>
        <StyledButton onClick={() => navigate('/sms/inbox')}>Inbox</StyledButton>
        <StyledButton onClick={() => navigate('/sms/send')}>Send Message</StyledButton>
      </StyledSMSLinks>
      <Outlet />
    </StyledSMSContainer>
  );
}
