import styled from "styled-components";

const StyledButton = styled.button`
  background: ${({ $variant }) =>
    $variant === "secondary" ? "#6c757d" : "#007bff"};
  color: #fff;
  font-size: ${({ $size }) => ($size === "large" ? "1.1rem" : "1rem")};
  padding: ${({ $size }) =>
    $size === "large" ? "0.9rem 1.5rem" : "0.7rem 1.2rem"};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "secondary" ? "#5a6268" : "#0056b3"};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}
