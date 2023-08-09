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
// router.post('/create', ActivityListController.create);

// Route for getting all activityLists for a specific user
// router.get('/:userId', authenticateJWT, ActivityListController.getAllForUser);
router.get('/:userId', ActivityListController.getAllForUser);

// Route for updating an activityList
// router.put('/update/:id', authenticateJWT, ActivityListController.update);
router.put('/update/:id', ActivityListController.update);

// Route for deleting an activityList
// router.delete('/delete/:id', authenticateJWT, ActivityListController.delete);
router.delete('/delete/:id', ActivityListController.delete);


// We export the router so we can use it in our main server file.
module.exports = router;
