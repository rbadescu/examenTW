const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Astronaut = sequelize.define("astronaut", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    numeAstronaut: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: 5
        }
    },
    rol: {
        type: DataTypes.ENUM({
            values: ['COMMANDER', 'PILOT']
        }),
        validate: {
            isIn: {
                args: [['COMMANDER', 'PILOT']],
                msg: "Acest camp poate lua doar valorile:['COMMANDER', 'PILOT']."
            }
        }
    }
});

module.exports = Astronaut;
