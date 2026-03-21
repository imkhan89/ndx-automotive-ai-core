require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
const webhookRoutes = require("./routes/webhook");

// IMPORTANT: This maps /webhook correctly
app.use("/webhook", webhookRoutes);

// ✅ Health check (Railway)
app.get("/", (req, res) => {
  res.status(200).send("🚀 ndestore WhatsApp AI is running");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
