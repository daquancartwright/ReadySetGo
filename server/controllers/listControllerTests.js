// activityListController

// Importing necessary modules and models
const ActivityList = require('../models/activityList');
const User = require('../models/user');

const activityListController = {};

// Create a new activity list
activityListController.create = async (req, res) => {
    try {
        const userId = req.body.userId;
        const activity = req.body.activity;
        const items = req.body.items;

        // Find the user by their unique identifier
        const user = await User.findByPk(userId);

        // If the user is not found, respond with a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if an activity list with the given activity name already exists for the user
        const existingActivityList = await ActivityList.findOne({
            where: { userId: userId, activity: activity }
        });

        // If the activity list does exist, respond with a 409 conflict error, providing a message
        if (existingActivityList) {
            return res.status(409).json({ error: 'List with this name already exists!' });
        }

        // If the activity list does not exist, create the new activity list
        const activityList = await ActivityList.create({ 
            userId: userId, 
            activity: activity, 
            items: items 
        });

        // Respond with a success message along with the created activity list
        res.json({ message: 'List created', activityList });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get all activity lists for a user
activityListController.getAllForUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findByPk(userId);

        // Check if the user exists
        if (!user) {
            console.log(`Error: User with userId ${userId} not found`); // Log error if user not found
            return res.status(404).json({ message: 'User not found' });
        }

        const activityLists = await ActivityList.findAll({
            where: {
                userId: userId
            }
        });

        // Extracting the 'id' from each activity list
        const ids = activityLists.map(activityList => activityList.id);

        console.log(`Successfully retrieved activity list IDs for userId ${userId}:`, ids); // Log success
        res.json(ids); // Respond with the array of IDs

    } catch (error) {
        console.log(`Error retrieving activity lists for userId ${userId}:`, error); // Log error with details
        res.status(500).json({ message: 'Something went wrong' });
    }
};


// Update an activity list
activityListController.update = async (req, res) => {
    const { id, userId } = req.params;
    const { activity, items } = req.body;

    // Validate input
    if (!activity || !items || !Array.isArray(items)) {
        console.log('Error: Invalid input'); // Log error for invalid input
        return res.status(400).json({ error: 'Invalid input' });
    }

    // Verify if the activity list exists for the provided userId and id
    const existingActivityList = await ActivityList.findOne({
        where: { id, userId },
    });

    if (!existingActivityList) {
        console.log(`Error: Activity list with id ${id} for userId ${userId} not found`); // Log error if activity list not found
        return res.status(404).json({ error: 'Activity list not found' });
    }

    try {
        const updatedActivityList = await ActivityList.update({
            activity,
            items
        }, {
            where: {
                id,
                userId
            },
            returning: true
        });

        console.log(`Activity list with id ${id} for userId ${userId} updated successfully`); // Log success
        res.json(updatedActivityList[1][0]);
    } catch (err) {
        console.log(`Error updating activity list with id ${id} for userId ${userId}:`, err); // Log error with details
        res.status(500).json(err);
    }
};


// Delete an activity list
activityListController.delete = async (req, res) => {
    const { id } = req.params;

    try {
        await ActivityList.destroy({
            where: {
                id
            }
        });

        res.json({ message: `ActivityList with id: ${id} deleted.` });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = activityListController;
