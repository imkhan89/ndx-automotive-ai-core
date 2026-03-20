const express = require("express");
const router = express.Router();

const messagePipeline = require("../orchestration/messagePipeline");

router.post("/", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const user = msg.from;
    const text = msg.text?.body || "";

    await messagePipeline.execute(user, text);

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
