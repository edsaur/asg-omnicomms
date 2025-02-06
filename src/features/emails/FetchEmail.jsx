import styled from "styled-components";
import { useFetchEmail } from "./useFetchEmail";
import { useNavigate } from "react-router";

// Styled Components
const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const EmailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const EmailTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  margin: 0;
`;

const EmailDate = styled.span`
  font-size: 0.9rem;
  color: #888;
`;

const EmailBody = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
  margin: 0;
`;

export default function FetchEmail() {
    const {emails, isLoading, error} = useFetchEmail();
    const navigate = useNavigate()
    if (isLoading) return <div>...Loading</div>
    if (error) return <div>{error.message}</div>
    
  return (
    <>
      {emails.map((email, index) => (
        <EmailContainer key={index} onClick={() => navigate(`/email/${email.uid}`)}>
          <EmailHeader>
            <EmailTitle>{email.subject}</EmailTitle>
            <EmailDate>{new Date(email.date).toLocaleString()}</EmailDate>
          </EmailHeader>
          <EmailBody>{email.body}</EmailBody>
        </EmailContainer>
      ))}
    </>
  );
}
