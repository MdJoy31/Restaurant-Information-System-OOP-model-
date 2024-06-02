const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const reservationRoutes = require("./routes/reservationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const { sequelize } = require("./models");
  sequelize
    .sync({ alter: true }) // Use alter instead of force
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((err) => {
      console.error("Error during models synchronization:", err);
    });
});
