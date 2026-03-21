const express = require("express");
const app = express();

const webhookRoutes = require("./routes/webhook");

app.use(express.json());

// ✅ Use router (CORRECT WAY)
app.use("/webhook", webhookRoutes);

// ✅ Basic health check (optional but safe)
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
