// Imports
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./db');  // Importing sequelize from db.js

const { authenticateJWT } = require('./authMiddleware');

// Importing our Routes
const userRoutes = require('./routes/userRoutes');
const activityListRoutes = require('./routes/activityListRoutes');

// Importing models
const User = require('./models/user');  // Importing the User model
const ActivityList = require('./models/activityList');  // Importing the ActivityList model

// We initialize the Express application.
const app = express();

// Potential error solution
app.options('*', cors());

// Middleware to enable Cross Origin Resource Sharing.
app.use(cors());

// Middleware to parse incoming requests with JSON payloads.
app.use(express.json());

// Middleware to serve static files. This is where our front end files would go.
app.use(express.static(path.join(__dirname, '../client')));

// Authenticating the connection with the database. If successful, the connection is established.
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        
        // Synchronizing all models
        sequelize.sync();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Middleware to use the user routes.
app.use('/api/users', userRoutes);
// Middleware to use the activityList routes.
app.use('/api/activity-lists',authenticateJWT, activityListRoutes);


// Test route to check if our server is working.
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An error occurred.' });
});

// We set the port for our server to run on and start the server.
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

