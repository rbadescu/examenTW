const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Spacecraft = sequelize.define("spacecraft", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    numeSpacecraft: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: 3,
        },
    },

    vitezaMax: {
        type: DataTypes.REAL,
        allowNull: false,
        validate: {
            min: 1001,
        },
    },
    masa: {
        type: DataTypes.REAL,
        allowNull: false,
        validate: {
            min: 201,
        },
    },
});

module.exports = Spacecraft;
