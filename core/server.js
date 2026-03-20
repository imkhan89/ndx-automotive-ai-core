require("dotenv").config();
const express = require("express");
const webhook = require("./webhookReceiver");

const app = express();
app.use(express.json());

app.use("/webhook", webhook);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
