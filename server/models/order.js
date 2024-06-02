"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      reservationId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for takeaway orders
        references: {
          model: "Reservations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      items: {
        type: DataTypes.JSON, // Store items as JSON
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      specialRequests: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
    },
    {}
  );

  Order.associate = function (models) {
    Order.belongsTo(models.Reservation, { foreignKey: "reservationId" });
    Order.belongsToMany(models.MenuItem, {
      through: "OrderItems",
      as: "menuItems",
      foreignKey: "orderId",
    });
  };

  return Order;
};
