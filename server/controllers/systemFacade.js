const ReservationFactory = require("../factories/ReservationFactory");
const OrderFactory = require("../factories/OrderFactory");
const PaymentFactory = require("../factories/PaymentFactory");
const { Reservation, Order, MenuItem, Payment } = require("../models");

class SystemFacade {
  // Reservation methods
  static async makeReservation(reservationData) {
    return await ReservationFactory.createReservation(reservationData);
  }

  static async viewReservation(reservationId) {
    return await Reservation.findByPk(reservationId);
  }

  static async updateReservation(reservationId, updateData) {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }
    await reservation.update(updateData);
    return reservation;
  }

  static async cancelReservation(reservationId) {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }
    await reservation.destroy();
    return reservation;
  }

  // Order methods
  static async createOrder(orderData) {
    return await OrderFactory.createOrder(orderData);
  }

  static async viewOrder(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: MenuItem,
          through: { attributes: [] },
        },
      ],
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  static async updateOrder(orderId, updateData) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    await order.update(updateData);
    return order;
  }

  static async cancelOrder(orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    await order.destroy();
    return order;
  }

  // Payment methods
  static async processPayment(orderId, method, cardDetails) {
    return await PaymentFactory.createPayment(orderId, method, cardDetails);
  }

  static async issueRefund(paymentId) {
    return await PaymentFactory.issueRefund(paymentId);
  }

  static async verifyCashPayment(orderId) {
    return await PaymentFactory.verifyCashPayment(orderId);
  }

  static async viewOrder(orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Fetch the item details from the menu
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
        const menuItem = await MenuItem.findByPk(item.itemId);
        if (!menuItem) {
          throw new Error(`Menu item with ID ${item.itemId} not found`);
        }
        return {
          ...item,
          name: menuItem.name,
          price: menuItem.price,
        };
      })
    );

    order.items = itemsWithDetails;
    return order;
  }

  static async getConfirmedOrdersForKitchen() {
    try {
      console.log("Fetching confirmed orders for kitchen...");

      const orders = await Order.findAll({
        where: { status: "confirmed" },
        include: [
          {
            model: MenuItem,
            as: "menuItems",
            attributes: ["id", "name", "price"],
            through: { attributes: [] }, // Exclude OrderItems from the result
          },
        ],
        attributes: [
          "id",
          "items",
          "totalPrice",
          "specialRequests",
          "status",
          "createdAt",
          "updatedAt",
        ],
      });

      if (!orders || orders.length === 0) {
        console.log("No confirmed orders found");
        return [];
      }

      console.log("Orders fetched: ", orders);

      // Process each order to get detailed item information
      const detailedOrders = orders.map((order) => {
        const itemsWithDetails = order.items.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));

        return {
          id: order.id,
          reservationId: order.reservationId,
          items: itemsWithDetails,
          totalPrice: order.totalPrice,
          specialRequests: order.specialRequests,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });

      console.log("Detailed confirmed orders for kitchen:", detailedOrders);

      return detailedOrders;
    } catch (error) {
      console.error(
        "Failed to retrieve confirmed orders for the kitchen:",
        error
      );
      throw new Error("Failed to retrieve orders");
    }
  }

  static async markOrderAsPrepared(orderId) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      await order.update({ status: "prepared" });
      return order;
    } catch (error) {
      console.error("Failed to mark order as prepared:", error);
      throw new Error("Failed to mark order as prepared");
    }
  }
}

module.exports = SystemFacade;
