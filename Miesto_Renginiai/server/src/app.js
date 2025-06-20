const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const adminRouter = require('./routes/admin');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/categories', categoriesRouter);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));