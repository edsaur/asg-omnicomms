import { Outlet, useNavigate } from "react-router";
import styled from "styled-components";
import Button from "./Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #f4f4f4;
  padding: 20px;
`;

const Content = styled.div`
  width: 90%;
  max-width: 800px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
  font-size: 1.5rem;
`;

const StyledEmailLinks = styled.div`
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

export default function Email() {
    const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Title>Email Dashboard</Title>
        <StyledEmailLinks>
            <StyledButton onClick={() => navigate('/email/inbox')}>Inbox</StyledButton>
            <StyledButton onClick={() => navigate('/email/send')}>Send Email</StyledButton>
        </StyledEmailLinks>
        <Outlet />
      </Content>
    </Container>
  );
}
