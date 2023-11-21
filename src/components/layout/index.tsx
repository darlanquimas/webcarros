import Header from "../header";
import { Outlet } from "react-router-dom";
import Container from "../container";

const Layout = () => {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
