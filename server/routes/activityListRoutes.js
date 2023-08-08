// activityListRoutes.js

// Importing required modules
const express = require('express');
const ActivityListController = require('../controllers/activityListController');  

// Importing the authenticateJWT middleware
const { authenticateJWT } = require('../authMiddleware'); 

// We initialize an Express router.
const router = express.Router();

// Route for creating a new activityList
// Add authenticateJWT middleware to protect this endpoint
router.post('/create', authenticateJWT, ActivityListController.create);

// Route for getting all activityLists for a specific user
// Add authenticateJWT middleware to protect this endpoint
router.get('/:userId', authenticateJWT, ActivityListController.getAllForUser);

// Route for updating an activityList
// Add authenticateJWT middleware to protect this endpoint
router.put('/update/:id', authenticateJWT, ActivityListController.update);

// Route for deleting an activityList
// Add authenticateJWT middleware to protect this endpoint
router.delete('/delete/:id', authenticateJWT, ActivityListController.delete);

// We export the router so we can use it in our main server file.
module.exports = router;
