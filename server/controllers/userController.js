const User = require('../models/user');
const bcrypt = require('bcryptjs');
const userController = {};

// The registerUser function creates a new User.
userController.registerUser = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });

        // If the User is successfully created, we send a 201 (created) status and a message.
        res.status(201).json({ message: 'User registered successfully!', user: newUser });
    } catch (error) {
        // If there's an error, we send a 500 (server error) status and a message.
        res.status(500).json({ error: 'Registration failed.' });
    }
};

// The loginUser function authenticates a User.
userController.loginUser = async (req, res) => {
    try {
        // Check if the username exists in the database
        const user = await User.findOne({ where: { username: req.body.username } });
        
        // If user not found, send error response
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        // Validate the password against the hashed password in the database
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        // If password is not valid, send error response
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        // Send successful login response
        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        // Send error response in case of failure
        res.status(500).json({ error: 'Login failed.' });
    }
};

// We export the userController object so we can use it in other parts of our app.
module.exports = userController;
