const express = require("express");
const router = express.Router();
const SystemFacade = require("../controllers/systemFacade");

// Process card payment
router.post("/card", async (req, res) => {
  try {
    const { orderId, cardDetails } = req.body;
    const payment = await SystemFacade.processPayment(
      orderId,
      "card",
      cardDetails
    );
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process cash payment
router.post("/cash", async (req, res) => {
  try {
    const { orderId } = req.body;
    const payment = await SystemFacade.processPayment(orderId, "cash");
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify and confirm cash payment
router.post("/verify-cash", async (req, res) => {
  try {
    const { orderId } = req.body;
    const payment = await SystemFacade.verifyCashPayment(orderId);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Issue a refund
router.post("/refund", async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await SystemFacade.issueRefund(paymentId);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
