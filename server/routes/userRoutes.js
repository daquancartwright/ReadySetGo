// We import the necessary packages and our userController.
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// We define the routes for user registration.
router.post('/register', userController.registerUser);


// We define the routes for user login.
router.post('/login', userController.loginUser);

// We export the router object so we can use it in other parts of our app.
module.exports = router;
