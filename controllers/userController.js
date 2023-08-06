const User = require('../server/models/user');
const bcrypt = require('bcryptjs');

const userController = {};

// Controller for user registration
userController.registerUser = async (req, res) => {
    try {
        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Create a new user with hashed password
        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword
            // Optionally handle the email here, if your frontend form includes it
        });

        // Send successful registration response
        res.status(201).json({ message: 'User registered successfully!', user: newUser });
    } catch (error) {
        // Send error response in case of failure
        res.status(500).json({ error: 'Registration failed.' });
    }
};

// Controller for user login
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

module.exports = userController;
