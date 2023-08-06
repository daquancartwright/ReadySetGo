const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing
require('dotenv').config();
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

// Database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    sequelize.sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Registration Logic
app.post('/api/users/register', async (req, res) => {
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create new user
        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully!', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// Login Logic
app.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        // If the password is correct, respond with success (Here, you can also generate a JWT token)
        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed.' });
    }
});

// Test Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
