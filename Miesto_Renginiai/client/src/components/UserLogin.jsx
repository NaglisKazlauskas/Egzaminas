import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

function UserLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      // Pass admin status to parent
      onLogin(res.data.isAdmin);
      history.replace("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 400 }}>
      <Card>
        <Card.Body>
          <Card.Title>Prisijungti</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Slaptožodis</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!email.trim() || !password.trim()}>
              Prisijungti
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <span>Neturi paskyros? </span>
            <Link to="/register">Registruokis čia</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserLogin;