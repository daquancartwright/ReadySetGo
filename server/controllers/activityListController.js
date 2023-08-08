// activityListController

// Importing necessary modules and models
const ActivityList = require('../models/activityList');
const User = require('../models/user');

const activityListController = {}

// Create a new activity list
activityListController.create = async (req, res) => {
    try {
        const userId = req.body.userId;
        const activity = req.body.activity;
        const items = req.body.items;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const activityList = await ActivityList.create({ 
            userId: userId, 
            activity: activity, 
            items: items 
        });

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

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const activityLists = await ActivityList.findAll({
            where: {
                userId: userId
            }
        });

        res.json(activityLists);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update an activity list
activityListController.update = async (req, res) => {
    const { id } = req.params;
    const { activity } = req.body;

    try {
        const updatedActivityList = await ActivityList.update({
            activity
        }, {
            where: {
                id
            }
        });

        res.json(updatedActivityList);
    } catch (err) {
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
