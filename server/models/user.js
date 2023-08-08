// We import Sequelize and our sequelize instance.
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db');  // Importing sequelize from db.js

// We define our User model.
class User extends Model {
    // Encrypt password
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    // Method to validate a plain text password against the user's hashed password.
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

// We initialize our User model with its properties and methods.
User.init({
    
    // Username: STRING
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Username cannot be null'
            },
            isAlphanumeric: {
                msg: 'Username should only contain letters and numbers'
            }
        }
    },

    // Email: String
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Email cannot be null'
            },
            isEmail: {
                msg: 'Invalid email format'
            }
        }
    },

    // Password: String
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            // We hash the password before a User is created.
            user.password = await User.hashPassword(user.password);
        },
        beforeUpdate: async (user) => {
            // We hash the new password before a User's password is updated.
            if (user.changed('password')) {
                user.password = await User.hashPassword(user.password);
            }
        }
    }
});

// Importing the ActivityList model after User model is defined.
const ActivityList = require('./activityList');  // Importing the ActivityList model

// Setting up the relationship between User and ActivityList
User.hasMany(ActivityList, { foreignKey: 'userId' });
ActivityList.belongsTo(User, { foreignKey: 'userId' });

// We export the User model so we can use it in other parts of our app.
module.exports = User;
