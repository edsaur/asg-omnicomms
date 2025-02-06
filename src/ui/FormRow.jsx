import styled from "styled-components";

// Form row container with responsive layout
const StyledFormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: .5rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  // If it contains a button (for submit/reset actions)
  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }

  // Responsive Design: Stack elements on smaller screens
  @media (max-width: 768px) {
    grid-template-columns: 1fr; 
    text-align: left;
  }
`;

// Label styling for accessibility & readability
const StyledLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

// Error message styling (if there’s an error)
const StyledError = styled.div`
  font-size: 0.875rem;
  color: #f44336;
  font-weight: 400;
  margin-top: 5px;
`;

export default function FormRow({ label = '', error = null, children }) {
  return (
    <StyledFormRow>
      <StyledLabel>{label}</StyledLabel>
      <div>
        {children}
        {error && <StyledError>{error}</StyledError>}
      </div>
    </StyledFormRow>
  );
}
