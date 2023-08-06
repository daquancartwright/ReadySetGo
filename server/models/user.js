// Import the Sequelize constructor, DataTypes object, and the Model class
const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

// Import the config for the current environment
const env = process.env.NODE_ENV || 'development';
const config = require('../config.json')[env];

// Create a new Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Define the User model with its attributes and their types
class User extends Model {
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

User.init({
    // Unique username, cannot be null
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
    // Email
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
    // Password, cannot be null
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            user.password = await User.hashPassword(user.password);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await User.hashPassword(user.password);
            }
        }
    }
});

// Export the User model
module.exports = User;
