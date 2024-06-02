const { Reservation } = require("../models");

class ReservationFactory {
  static async createReservation(data) {
    return await Reservation.create(data);
  }

  static async getReservation(id) {
    return await Reservation.findByPk(id);
  }

  static async updateReservation(id, data) {
    const [updated] = await Reservation.update(data, {
      where: { id },
    });
    if (updated) {
      return await Reservation.findByPk(id);
    }
    throw new Error("Reservation not found");
  }

  static async deleteReservation(id) {
    const deleted = await Reservation.destroy({
      where: { id },
    });
    if (!deleted) {
      throw new Error("Reservation not found");
    }
  }
}

module.exports = ReservationFactory;
