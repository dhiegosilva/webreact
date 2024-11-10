const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("db_289311_3", "USER289311", "Ds21032962", {
  host: "dhiego.lima-db.de",
  dialect: "mysql",
});

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
  },
});

sequelize.sync();

module.exports = { sequelize, User };
