// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const SystemFacade = require("../controllers/systemFacade");

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { reservationId, items, specialRequests } = req.body;

    // Calculate total price
    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create order
    const order = await SystemFacade.createOrder({
      reservationId,
      items,
      totalPrice,
      specialRequests,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get an order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await SystemFacade.viewOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an order by ID
router.put("/:id", async (req, res) => {
  try {
    const order = await SystemFacade.updateOrder(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order by ID
router.delete("/:id", async (req, res) => {
  try {
    const order = await SystemFacade.cancelOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get confirmed orders for kitchen
router.get("/kitchen", async (req, res) => {
  try {
    const orders = await SystemFacade.getConfirmedOrdersForKitchen();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark order as prepared
router.post("/prepared", async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await SystemFacade.markOrderAsPrepared(orderId);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
