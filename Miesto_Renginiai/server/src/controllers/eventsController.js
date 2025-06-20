const events = []; // Temporary in-memory storage for events

// Create a new event
exports.createEvent = (req, res) => {
    const { title, date, location, description } = req.body;
    const newEvent = { id: events.length + 1, title, date, location, description };
    events.push(newEvent);
    res.status(201).json(newEvent);
};

// Retrieve all events
exports.getAllEvents = (req, res) => {
    res.status(200).json(events);
};

// Retrieve a single event by ID
exports.getEventById = (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    if (event) {
        res.status(200).json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// Update an event by ID
exports.updateEvent = (req, res) => {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        const { title, date, location, description } = req.body;
        events[eventIndex] = { id: eventId, title, date, location, description };
        res.status(200).json(events[eventIndex]);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// Delete an event by ID
exports.deleteEvent = (req, res) => {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events.splice(eventIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};