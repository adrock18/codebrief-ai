// 1. Import all our tools
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // This line loads the .env file contents

// 2. Initialize the Express App
const app = express();

// 3. Apply Middleware
app.use(cors()); // Allow requests from other origins
app.use(express.json()); // Allow the server to accept JSON data in request bodies

// Define API Routes. Any request starting with /api/users will be handled by userRoutes.js
app.use('/api/users', require('./routes/userRoutes'));

// Any request starting with /api/summarize will be handled by summarizeRoutes.js
app.use('/api/summarize', require('./routes/summarizeRoutes'));


// 4. Connect to our MongoDB Database
const MONGO_URI = process.env.MONGO_URI; // Get the connection string from .env
mongoose.connect(MONGO_URI)
    .then(() => console.log('SUCCESS: MongoDB connected successfully.'))
    .catch(err => console.error('ERROR: MongoDB connection error:', err));

// 5. Create a simple test route to see if the server is working
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the CodeBrief AI API!' });
});

// 6. Start the server and listen for requests
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001
app.listen(PORT, () => console.log(`INFO: Server is running on port ${PORT}`));