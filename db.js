const sequelize = require('sequelize');

const db = new sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/database.db'
});

// table for Products
const Product = db.define('product', {
    name: {
        type: sequelize.STRING(50),
        allowNull: false
    },

    brand: {
        type: sequelize.STRING(50),
        allowNull: false
    },

    category: {
        type: sequelize.STRING(50),
        allowNull: false
    },

    picture1: {
        type: sequelize.TEXT,
        allowNull: false
    },
    picture2: {
        type: sequelize.TEXT,
        allowNull: false
    },
    picture3: {
        type: sequelize.TEXT
    },

    description: {
        type: sequelize.TEXT,
        allowNull: false
    },

    price: {
        type: sequelize.FLOAT,
        allowNull: false
    },

    discount: {
        // stores discount percentage
        type: sequelize.FLOAT,
        default: 0.00
    }
})

module.exports = {
    db, Product
}
