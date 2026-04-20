const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log('✅ MongoDB Connected successfully');
    
    // Implement Indexing for performance optimization
    const Match = require('./models/Match');
    const Player = require('./models/Player');
    await Match.collection.createIndex({ tournament_id: 1 });
    await Player.collection.createIndex({ team_id: 1 });
    console.log('✅ MongoDB Indexes created/verified successfully');
})
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Serve frontend for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
