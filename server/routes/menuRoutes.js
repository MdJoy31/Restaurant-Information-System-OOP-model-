const express = require("express");
const router = express.Router();
const { MenuItem } = require("../models");

const STAFF_USERNAME = "admin";
const STAFF_PASSWORD = "password";

// Basic auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  if (username === STAFF_USERNAME && password === STAFF_PASSWORD) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
}

// Create a new menu item
router.post("/", auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a menu item by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    await menuItem.update(req.body);
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a menu item by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    await menuItem.destroy();
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
