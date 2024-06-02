"use strict";
module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define(
    "MenuItem",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
      },
    },
    {}
  );

  MenuItem.associate = function (models) {
    MenuItem.belongsToMany(models.Order, {
      through: "OrderItems",
      as: "orders",
      foreignKey: "menuItemId",
    });
  };

  return MenuItem;
};
