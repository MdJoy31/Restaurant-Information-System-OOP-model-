"use strict";
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      name: DataTypes.STRING,
      contact: DataTypes.STRING,
      date: DataTypes.DATE,
      time: DataTypes.STRING,
      numberOfGuests: DataTypes.INTEGER,
      specialRequests: DataTypes.STRING,
      confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  );

  Reservation.associate = function (models) {
    Reservation.hasMany(models.Order, { foreignKey: "reservationId" });
  };

  return Reservation;
};
