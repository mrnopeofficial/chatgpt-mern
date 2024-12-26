const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
