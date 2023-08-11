const { Sequelize } = require('sequelize');
require('dotenv').config();

// We initialize Sequelize with our database information, which we pull in from a .env file.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

// sequelize.authenticate()
//     .then(() => {
//         console.log('Database connection has been established successfully.');
        
//         // Synchronizing all models
//         sequelize.sync();
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });


// Exporting the Sequelize instance so it can be used elsewhere in the project.
module.exports = sequelize;
