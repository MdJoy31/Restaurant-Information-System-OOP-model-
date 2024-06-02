const { Order, MenuItem } = require("../models");

class OrderFactory {
  static async createOrder(orderData) {
    const { items } = orderData;
    let totalPrice = 0;

    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const menuItem = await MenuItem.findByPk(item.itemId);
        if (!menuItem) {
          throw new Error(`Menu item with ID ${item.itemId} not found`);
        }
        totalPrice += menuItem.price * item.quantity;
        return {
          itemId: item.itemId,
          name: menuItem.name,
          quantity: item.quantity,
          price: menuItem.price,
        };
      })
    );

    const order = new Order({
      ...orderData,
      items: itemsWithDetails,
      totalPrice,
    });

    await order.save();
    return order;
  }
}

module.exports = OrderFactory;
