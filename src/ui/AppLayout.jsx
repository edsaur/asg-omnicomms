import { Outlet } from "react-router";
import styled from "styled-components";
import Header from "./Header";

// Style for the App layout container
const StyledAppLayout = styled.main`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f4f4f9;
  min-height: 100vh;

`;

export default function AppLayout() {
  return (
    <>
      <Header />
      <StyledAppLayout>
        <Outlet />
      </StyledAppLayout>
    </>
  );
}
