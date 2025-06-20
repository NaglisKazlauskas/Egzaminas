import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Container } from "react-bootstrap";
import axios from "axios";

function EventList() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState({}); // { [eventId]: { count, userRated } }
const userId = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    axios.get("/api/events?approved=1").then(res => setEvents(res.data));
    axios.get("/api/categories").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    // Fetch ratings for all events
    if (events.length && userId) {
      events.forEach(ev => {
        axios
          .get(`/api/events/${ev.id}/ratings`, { params: { user_id: userId } })
          .then(res =>
            setRatings(r => ({ ...r, [ev.id]: res.data }))
          );
      });
    }
  }, [events, userId]);

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id == id);
    return cat ? cat.name : "Unassigned";
  };

  const handleStar = (eventId, userRated) => {
    if (userRated) {
      axios.delete(`/api/events/${eventId}/rate`, { data: { user_id: userId } })
        .then(() => {
          setRatings(r => ({
            ...r,
            [eventId]: { ...r[eventId], count: r[eventId].count - 1, userRated: false }
          }));
        });
    } else {
      axios.post(`/api/events/${eventId}/rate`, { user_id: userId })
        .then(() => {
          setRatings(r => ({
            ...r,
            [eventId]: { ...r[eventId], count: (r[eventId]?.count || 0) + 1, userRated: true }
          }));
        });
    }
  };

  return (
    <Container className="mt-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {events.map(ev => (
          <Col key={ev.id}>
            <Card className="h-100 shadow-sm" style={{ position: "relative" }}>
              {ev.photo && (
                <Card.Img
                  variant="top"
                  src={ev.photo}
                  alt={ev.title}
                  style={{ objectFit: "cover", height: "180px" }}
                />
              )}
              <Card.Body style={{ position: "relative", paddingBottom: "2.5em" }}>
                <Card.Title>{ev.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {getCategoryName(ev.category_id)}
                  {ev.blocked === 1 && <Badge bg="danger" className="ms-2">Blocked</Badge>}
                  {ev.approved === 0 && <Badge bg="warning" text="dark" className="ms-2">Pending</Badge>}
                </Card.Subtitle>
                <Card.Text style={{ minHeight: 60 }}>{ev.description}</Card.Text>
                <div>
                  <strong>Data:</strong> {ev.event_date && new Date(ev.event_date).toLocaleDateString()}
                </div>
                <div>
                  <Card.Text>
                    <strong>Vieta:</strong> {ev.location}
                  </Card.Text>
                </div>
                {/* Star rating in bottom right */}
                <div
                  style={{
                    position: "absolute",
                    right: "1em",
                    bottom: "1em",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <span
                    style={{
                      cursor: "pointer",
                      color: ratings[ev.id]?.userRated ? "gold" : "gray",
                      fontSize: "1.5em",
                      verticalAlign: "middle"
                    }}
                    onClick={() => handleStar(ev.id, ratings[ev.id]?.userRated)}
                    title={ratings[ev.id]?.userRated ? "Remove your star" : "Give a star"}
                  >
                    ★
                  </span>
                  <span style={{ marginLeft: 6, fontSize: "1.1em", verticalAlign: "middle" }}>
                    {ratings[ev.id]?.count || 0}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default EventList;