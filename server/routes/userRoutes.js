const express = require('express');
const router = express.Router();
// Import the user controller to map the functions to the routes
const userController = require('../../controllers/userController');

// Map the registration endpoint to the corresponding controller function
router.post('/register', userController.registerUser);

// Map the login endpoint to the corresponding controller function
router.post('/login', userController.loginUser);

module.exports = router;
