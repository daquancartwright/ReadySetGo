// Importing required modules
const express = require('express');
const ActivityListController = require('../controllers/activityListController');  // Ensure the path is correct

// We initialize an Express router.
const router = express.Router();

// Route for creating a new activityList
router.post('/create', ActivityListController.create);

// Route for getting all activityLists for a specific user
router.get('/:userId', ActivityListController.getAllForUser);

// Route for updating an activityList
router.put('/update/:id', ActivityListController.update);

// Route for deleting an activityList
router.delete('/delete/:id', ActivityListController.delete);

// We export the router so we can use it in our main server file.
module.exports = router;
