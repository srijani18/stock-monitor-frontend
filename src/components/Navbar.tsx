import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
// import { ThemeToggle } from "./ThemeToggle";

export const NavbarComponent: React.FC = () => {
  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Container fluid className="ms-4">
        <Navbar.Brand href="#">📊 StockMonitor</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
          <Nav.Link as={NavLink} to="/alerts">Alerts</Nav.Link>
            <Nav.Link href="#">Settings</Nav.Link>
          </Nav>
          {/* <ThemeToggle /> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
