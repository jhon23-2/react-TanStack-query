const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ["todo", "done"],
    defaultValue: "todo"
  },
  priority: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ["low", "medium", "high"],
    defaultValue: "low"
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "tasks",
  timestamps: true,
})


module.exports = Task