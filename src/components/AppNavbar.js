import Container from 'react-bootstrap/Container';
import { useContext, useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import UserContext from '../UserContext';
import logo from '../assets/tb-logo-small.png';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMdScreen = screenWidth >= 768; // Bootstrap's md breakpoint

  return (
    <Navbar expand={isMdScreen ? 'md' : false} className="py-0">
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="navbar-brand-title fw-bold"
          style={{ fontSize: '25px' }}
        >
          <div className="d-flex align-items-center">
            <img src={logo} alt="" height="30px" />
            <h2 className="cursive-text fw-bold">TroubleBubble</h2>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar">
          <Nav className={isMdScreen ? 'ms-auto' : 'me-auto'}>
            <Nav.Link as={NavLink} to="/" className="navbar-link">
              Home
            </Nav.Link>

            {user.id !== null ? (
              <>
                <Nav.Link as={NavLink} to="/myPosts" className="navbar-link">
                  My Posts
                </Nav.Link>
                <Nav.Link as={NavLink} to="/logout" className="navbar-link">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="navbar-link">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="navbar-link">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
