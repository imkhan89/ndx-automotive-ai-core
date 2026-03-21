require("dotenv").config();

const express = require("express");

const app = express();


// =====================================================
// ✅ MIDDLEWARE
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================================
// ✅ ROUTES
// =====================================================

// Import webhook route (MAKE SURE FILE EXISTS)
const webhookRoutes = require("./routes/webhook");

// Mount webhook route
app.use("/webhook", webhookRoutes);


// =====================================================
// ✅ HEALTH CHECK (Railway Required)
// =====================================================
app.get("/", (req, res) => {
  res.status(200).send("🚀 ndestore WhatsApp AI Server Running");
});


// =====================================================
// ✅ ERROR HANDLER (IMPORTANT FOR DEBUGGING)
// =====================================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).send("Internal Server Error");
});


// =====================================================
// ✅ START SERVER
// =====================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Webhook URL: /webhook`);
  console.log("=================================");
});
