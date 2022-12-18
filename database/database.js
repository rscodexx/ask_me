const Sequelize = require('sequelize');

const connection = new Sequelize('ask', 'rafael', 'rafael', {
    host: 'localhost',
    port: 33061,
    dialect: 'mysql',
});

module.exports = connection;
