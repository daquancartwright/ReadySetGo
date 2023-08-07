// Imports
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./db');  // Importing sequelize from db.js

// Importing the user routes, so we can use the endpoints in this file.
const userRoutes = require('./routes/userRoutes');

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
        sequelize.sync();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Middleware to use the user routes.
app.use('/api/users', userRoutes);

// Test route to check if our server is working.
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// We set the port for our server to run on and start the server.
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

