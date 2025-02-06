import { NavLink } from "react-router";
import styled from "styled-components";
import Button from "./Button";
import { logout } from "../api/apiUsers";
import { useSignOut } from "../features/authentication/useSignOut";
import { useUser } from "../features/authentication/useUser";

// Style for the header container
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #4CAF50;
  color: white;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Style for the brand title
const BrandTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  color: white;
`;

// Style for the navigation menu
const NavMenu = styled.nav`
  display: flex;
  gap: 15px;
`;

// Style for the navigation links (active link styles included)
const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 5px;

  &.active {
    background-color: #2E8B57;
    font-weight: bold;
  }

  &:hover {
    background-color: #388E3C;
  }
`;

export default function Header() {

  const {mutate: logout, isPending} = useSignOut();
  const {user, isAuthenticated} = useUser();
  return (
    <HeaderContainer>
      <BrandTitle>OmniComms</BrandTitle>
      <NavMenu>
        <StyledNavLink to="/chat" activeClassName="active">Chat</StyledNavLink>
        <StyledNavLink to="/email" activeClassName="active">Email</StyledNavLink>
        <StyledNavLink to="/sms" activeClassName="active">SMS</StyledNavLink>
        <StyledNavLink to="/call" activeClassName="active">Call</StyledNavLink>
      </NavMenu>
      {isAuthenticated && <Button onClick={logout} disabled={isPending}>Signout</Button>}
    </HeaderContainer>
  );
}
