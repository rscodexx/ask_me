const Sequelize = require('sequelize');
const connection = require('./database');

const Reply = connection.define('reply', {
    ask_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});

Reply.sync({force: false}).then(() => {});

module.exports = Reply;
