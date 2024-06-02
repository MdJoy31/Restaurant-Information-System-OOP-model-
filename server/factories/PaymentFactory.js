const { Payment, Order } = require("../models");

class PaymentFactory {
  static async createPayment(orderId, method, cardDetails) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (method === "card" && cardDetails) {
      const payment = await Payment.create({
        orderId,
        method,
        amount: order.totalPrice,
        cardNumber: cardDetails.cardNumber,
        cardExpiry: cardDetails.cardExpiry,
        cardCVV: cardDetails.cardCVV,
        status: "confirmed",
      });
      await order.update({ status: "confirmed" });
      return payment;
    }

    if (method === "cash") {
      const payment = await Payment.create({
        orderId,
        method,
        amount: order.totalPrice,
        status: "pending",
      });
      return payment;
    }

    throw new Error("Invalid payment method");
  }

  static async issueRefund(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    await payment.update({ status: "refunded" });
    const order = await Order.findByPk(payment.orderId);
    await order.update({ status: "cancelled" });
    return payment;
  }

  static async verifyCashPayment(orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const payment = await Payment.findOne({
      where: { orderId, method: "cash" },
    });
    if (!payment) {
      throw new Error("Payment not found");
    }

    await payment.update({ status: "confirmed" });
    await order.update({ status: "confirmed" });
    return payment;
  }
}

module.exports = PaymentFactory;
