const express = require("express");
const router = express.Router();
const { Reservation } = require("../models");

// Create a new reservation
router.post("/", async (req, res) => {
  try {
    const { date, time, numberOfGuests } = req.body;

    // Check total number of guests for the given date and time
    const totalGuests = await Reservation.sum("numberOfGuests", {
      where: { date, time },
    });

    if (totalGuests + numberOfGuests > 50) {
      return res.status(400).json({
        error: "Maximum number of guests exceeded for the given date and time",
      });
    }

    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a reservation by ID
router.put("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    await reservation.update(req.body);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a reservation by ID
router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    await reservation.destroy();
    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
