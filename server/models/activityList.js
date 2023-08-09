// activityList.js

// Imports
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');  // Importing sequelize from db.js
const User = require('./user');  // Importing the User model

// We define our ActivityList model.
class ActivityList extends Model {}

// We initialize our ActivityList model with its properties.
ActivityList.init({
    
    // Activity: String
    activity: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Items: Array
    items: {
        // type: DataTypes.ARRAY(DataTypes.STRING),
        type: DataTypes.TEXT,
        allowNull: false,
        // Deserialize the JSON string back to an array
        get() {
            return JSON.parse(this.getDataValue('items'));
        },
        // Serialize the array to a JSON String
        set(val) {
            this.setDataValue('items', JSON.stringify(val))
        }
    },


    // User Id: Foreign Key
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: 'activityLists',
});

// We export the ActivityList model so we can use it in other parts of our app.
module.exports = ActivityList;
