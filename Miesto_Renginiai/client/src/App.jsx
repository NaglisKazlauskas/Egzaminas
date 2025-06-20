import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import AdminDashboard from "./components/AdminDashboard";
import EventList from "./components/EventList";
import UserLogin from "./components/UserLogin";
import Register from "./components/Register";
import CreateEvent from "./components/CreateEvent";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("isAdmin") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("isAdmin", isAdmin);
  }, [isAuthenticated, isAdmin]);

  const PrivateRoute = ({ children, ...rest }) => (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );

  // Simulate login: pass isAdmin as true/false as needed
  const handleLogin = (admin = false) => {
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
  };

  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Miesto Renginiai</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/events">Renginių sąrašas</Nav.Link>
              <Nav.Link as={Link} to="/create-event">Kurti Renginį</Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/admin">Administratoriaus panele</Nav.Link>
              )}
            </Nav>
            {isAuthenticated && (
              <Button variant="outline-light" onClick={handleLogout}>
                Atsijungti
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Switch>
          <Route path="/login">
            {isAuthenticated ? (
            <Redirect to="/events" />
            ) : (
            <UserLogin onLogin={(admin) => handleLogin(admin)} />
          )}
          </Route>
          <Route path="/register" component={Register} />
          <PrivateRoute path="/create-event">
            <CreateEvent />
          </PrivateRoute>
          <PrivateRoute path="/admin">
            <AdminDashboard />
          </PrivateRoute>
          <PrivateRoute path="/events">
            <EventList />
          </PrivateRoute>
        </Switch>
      </Container>
      <footer className="bg-light text-center py-3 mt-4">
        <small>&copy; {new Date().getFullYear()} EventShare. All rights reserved.</small>
      </footer>
    </Router>
  );
}

export default App;