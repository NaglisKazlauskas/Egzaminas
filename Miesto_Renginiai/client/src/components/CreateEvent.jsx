import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function CreateEvent() {
const [form, setForm] = useState({
  title: "",
  description: "",
  event_date: "",
  category_id: "",
  location: ""
});
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user_id = localStorage.getItem("user_id") || 1;

  useEffect(() => {
    axios.get("/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("user_id", user_id);
      if (photo) data.append("photo", photo);

      const res = await axios.post("/api/events/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(res.data.message);
      setForm({ title: "", description: "", event_date: "", category_id: "" });
      setPhoto(null);
    } catch (err) {
      setError(err.response?.data?.error || "Event creation failed.");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <Card>
        <Card.Body>
          <Card.Title>Kurti naują rengenį</Card.Title>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="eventTitle">
              <Form.Label>Pavadinimas</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter event title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventDescription">
              <Form.Label>Aprašymas</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Enter event description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventDate">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventLocation">
              <Form.Label>Vieta</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Enter event location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventCategory">
              <Form.Label>Kategorija</Form.Label>
              <Form.Select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventPhoto">
              <Form.Label>Nuotrauka (neprivaloma)</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sukurti renginį
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateEvent;