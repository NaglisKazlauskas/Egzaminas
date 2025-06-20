import React, { useEffect, useState } from "react";
import { Container, Card, Button, Table, Form, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const [editEvent, setEditEvent] = useState({});

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    try {
      const [pending, usersRes, cats] = await Promise.all([
        axios.get("/api/events?approved=0"),
        axios.get("/api/admin/users"),
        axios.get("/api/categories"),
      ]);
      setPendingEvents(pending.data);
      setUsers(usersRes.data);
      setCategories(cats.data);
    } catch (err) {
      setError("Failed to fetch admin data.");
    }
  };

  // Event actions
  const approveEvent = async (id) => {
    await axios.post(`/api/admin/events/${id}/approve`);
    setEditEventId(null);
    fetchAll();
  };
  const startEditEvent = (event) => {
    setEditEventId(event.id);
    setEditEvent({ ...event });
  };
  const handleEditChange = (e) => {
    setEditEvent({ ...editEvent, [e.target.name]: e.target.value });
  };
  const saveEditEvent = async () => {
    await axios.put(`/api/admin/events/${editEventId}`, editEvent);
    setEditEventId(null);
    fetchAll();
  };
  const deleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await axios.delete(`/api/admin/events/${id}`);
      setEditEventId(null);
      fetchAll();
    }
  };

  // User actions
  const banUser = async (id) => {
    await axios.post(`/api/admin/users/${id}/Blokuoti`);
    fetchAll();
  };
  const unbanUser = async (id) => {
    await axios.post(`/api/admin/users/${id}/atkelti Blokavimą`);
    fetchAll();
  };
  const makeAdmin = async (id) => {
    await axios.post(`/api/admin/users/${id}/Padaryti administratoriumi`);
    fetchAll();
  };

  // Category actions
  const createCategory = async (e) => {
    e.preventDefault();
    await axios.post("/api/admin/categories", { name: newCategory });
    setNewCategory("");
    fetchAll();
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id == id);
    return cat ? cat.name : "Unassigned";
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Administratoriaus panele</Card.Title>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Pending Events as Cards */}
          <h5 className="mt-4">Reikalinga Patvirtinimo</h5>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {pendingEvents.map(ev =>
              editEventId === ev.id ? (
                <Col key={ev.id}>
                  <Card className="h-100 shadow-sm">
                    {editEvent.photo && (
                      <Card.Img
                        variant="top"
                        src={editEvent.photo}
                        alt={editEvent.title}
                        style={{ objectFit: "cover", height: "180px", width: "100%" }}
                      />
                    )}
                    <Card.Body>
                      <Form.Group className="mb-2">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control
                          name="title"
                          value={editEvent.title}
                          onChange={handleEditChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Aprašymas</Form.Label>
                        <Form.Control
                          name="description"
                          value={editEvent.description}
                          onChange={handleEditChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="event_date"
                          value={editEvent.event_date?.slice(0, 10)}
                          onChange={handleEditChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Kategorija</Form.Label>
                        <Form.Select
                          name="category_id"
                          value={editEvent.category_id}
                          onChange={handleEditChange}
                        >
                          <option value="">Select</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Vieta</Form.Label>
                        <Form.Control
                          name="location"
                          value={editEvent.location || ""}
                          onChange={handleEditChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Nuotrauka</Form.Label>
                        <Form.Control
                          name="photo"
                          value={editEvent.photo || ""}
                          onChange={handleEditChange}
                          placeholder="Photo URL"
                        />
                        <div>
                          {editEvent.photo && (
                            <img src={editEvent.photo} alt="event" style={{ width: 50, marginTop: 4 }} />
                          )}
                        </div>
                      </Form.Group>
                      <Button size="sm" onClick={saveEditEvent}>Išsaugoti</Button>{" "}
                      <Button size="sm" variant="secondary" onClick={() => setEditEventId(null)}>Atšaukti</Button>{" "}
                      <Button size="sm" variant="danger" onClick={() => deleteEvent(editEvent.id)}>Trinti</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ) : (
                <Col key={ev.id}>
                  <Card className="h-100 shadow-sm">
                    {ev.photo && (
                      <Card.Img
                        variant="top"
                        src={ev.photo}
                        alt={ev.title}
                        style={{ objectFit: "cover", height: "180px", width: "100%" }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{ev.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {getCategoryName(ev.category_id)}
                      </Card.Subtitle>
                      <Card.Text style={{ minHeight: 60 }}>{ev.description}</Card.Text>
                      <div>
                        <strong>Date:</strong> {ev.event_date && new Date(ev.event_date).toLocaleDateString()}
                      </div>
                      <div>
                        <Card.Text>
                          <strong>Location:</strong> {ev.location}
                        </Card.Text>
                      </div>
                      <Button size="sm" onClick={() => approveEvent(ev.id)}>Patvirtinti</Button>{" "}
                      <Button size="sm" variant="warning" onClick={() => startEditEvent(ev)}>Modifikuoti</Button>{" "}
                      <Button size="sm" variant="danger" onClick={() => deleteEvent(ev.id)}>Trinti</Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            )}
          </Row>

          {/* Users */}
          <h5 className="mt-4">Users</h5>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Pavadinimas</th><th>Email</th><th>Administratorius</th><th>Užblokuotas</th><th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.is_admin ? "Yes" : "No"}</td>
                  <td>{u.banned ? "Yes" : "No"}</td>
                  <td>
                    {!u.is_admin && (
                      <Button size="sm" variant="info" onClick={() => makeAdmin(u.id)}>Padaryti administratoriumi</Button>
                    )}{" "}
                    {!u.banned && (
                      <Button size="sm" variant="danger" onClick={() => banUser(u.id)}>Blokuoti</Button>
                    )}
                    {u.banned && (
                      <Button size="sm" variant="success" onClick={() => unbanUser(u.id)}>Atblokuoti</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Create Category */}
          <h5 className="mt-4">Sukurti Kategoriją</h5>
          <Form onSubmit={createCategory} className="d-flex">
            <Form.Control
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              required
            />
            <Button type="submit" className="ms-2">Pridėti</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;