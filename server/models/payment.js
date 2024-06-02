"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      cardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cardExpiry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cardCVV: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {}
  );

  Payment.associate = function (models) {
    Payment.belongsTo(models.Order, { foreignKey: "orderId" });
  };

  return Payment;
};
