import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage(res.data.message);
      setForm({ username: "", email: "", password: "" });
      setTimeout(() => {
        history.push("/login");
      }, 1000); // Redirect after 1 second
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 400 }}>
      <Card>
        <Card.Body>
          <Card.Title>Registruoti</Card.Title>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="registerUsername">
              <Form.Label>Vardas</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label>Slaptožodis</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Registruotis
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;