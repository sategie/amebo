import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
        <Navbar.Brand className={styles.navBrand}>
          <img src={logo} alt="logo" height="100" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link className={styles.navLink}>
            <i class="fa-solid fa-house"></i>Home
            </Nav.Link>
            <Nav.Link className={styles.navLink}>
            <i className="fa-solid fa-square-rss"></i>Posts
            </Nav.Link>
            <Nav.Link className={styles.navLink}>
            <i class="fa-solid fa-right-to-bracket"></i>Login
            </Nav.Link>
            <Nav.Link className={styles.navLink}>
            <i class="fa-solid fa-user-plus"></i>Signup
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );    
};

export default NavBar;