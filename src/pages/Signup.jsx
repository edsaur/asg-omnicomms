import styled from "styled-components";
import UserSignup from "../features/authentication/UserSignup";
import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router";
import { useEffect } from "react";

// Styled container for centering the form
const StyledSignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; // Full screen height
  font-family: Arial, Helvetica, sans-serif; // Add Google Font
`;

// Styled heading

export default function Signup() {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate("/");
  }, [navigate, isAuthenticated, isLoading]);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <StyledSignupContainer>
        <UserSignup />
      </StyledSignupContainer>
    );
  }
}
