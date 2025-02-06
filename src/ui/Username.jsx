import styled from "styled-components";
import { useUsername } from "../features/authentication/useUsername";

const StyledUsername = styled.span`
  font-weight: bold;
  color: #0066cc;
`;

export default function Username({uid}){
    const {username, isLoading} = useUsername(uid);
    if (isLoading) return null;

    return (
        <StyledUsername>
            {!isLoading && username.username}
        </StyledUsername>
    )
} 