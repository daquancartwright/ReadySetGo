// userController.js

// Importing necessary modules and models
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const userController = {};


// The registerUser function creates a new User and returns a JWT token.
userController.registerUser = async (req, res) => {
    try {       
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,  // Save hashed password
            email: req.body.email
        });
        
        // Create and sign the JWT token
        const token = jwt.sign({ id: newUser.id },'KotoAmatsukami@1', {
            expiresIn: '1h'
        });
        
        // If the User is successfully created, we send a 201 (created) status, a JWT token, and a message.
        res.status(201).json({
            message: 'User registered successfully!',
            token: token,
            user: newUser
        });
    } catch (error) {
        // If there's an error, we send a 500 (server error) status and a message.
        res.status(500).json({ error: 'Registration failed.' });
    }
};

// The loginUser function authenticates a User and returns a JWT token.
userController.loginUser = async (req, res) => {
    try {
        // Check if the username exists in the database
        const user = await User.findOne({ where: { username: req.body.username } });
        
        // If user not found, send error response
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }
        
        // Validate the password against the hashed password in the database
        const validPassword = await user.validPassword(req.body.password);
        
        // If password is not valid, send error response
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password.' })        
        }
        
        // Create and sign the JWT token for valid users
        const token = jwt.sign({ id: user.id }, 'KotoAmatsukami@1', {
            expiresIn: '1h'
        });
        
        
        // Send successful login response with the JWT token
        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: user
        });
    } catch (error) {
        // Send error response in case of failure
        res.status(500).json({ error: 'Login failed.' });
    }
};

userController.getUserId = (req, res) => {
    try {
      // Extract token from header
      const token = req.header('Authorization').replace('Bearer ', '');
      // Verify and decode the token
      const decoded = jwt.verify(token, 'KotoAmatsukami@1');
      // Send the userId back to the client
      res.json({ userId: decoded.id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user ID.' });
    }
  };

// We export the userController object so we can use it in other parts of our app.
module.exports = userController;
