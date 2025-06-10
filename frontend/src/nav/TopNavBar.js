import { Navbar, Nav, Container } from 'react-bootstrap';

function TopNavbar({ setActivePage, token, isPremium }) {
  function makeSomeNoise(){
    let navbar = document.getElementById("Navbar").style;
    navbar.animation = "hueShift 5s linear"
  }

  return (
    <Navbar id="Navbar" bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand onClick={() => setActivePage('fuse')} style={{ cursor: 'pointer' }}>
          PokeFusion
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token ? (
                <>
              <Nav.Link onClick={() => setActivePage('logout')}>Logout</Nav.Link>
              <Nav.Link onClick={() => setActivePage('fuse')}>Fuse</Nav.Link>
              <Nav.Link onClick={() => setActivePage('myfusions')}>My Fusions</Nav.Link>
              <Nav.Link onClick={() => setActivePage('premium')}>Premium</Nav.Link>
              {isPremium? (<Nav.Link onClick={() => makeSomeNoise()}>🏆</Nav.Link>) : (<></>)}
              </>
            ) : (
                <>
                <Nav.Link onClick={() => setActivePage('login')}>Login</Nav.Link>
                <Nav.Link onClick={() => setActivePage('register')}>Register</Nav.Link>
              </>
            )}
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
