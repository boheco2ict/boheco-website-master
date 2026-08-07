require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify Gmail connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail Server Error:");
    console.error(error);
  } else {
    console.log("✅ Mail Server Ready");
  }
});

app.post("/send-approval-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || (!text)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields.",
      });
    }

    const info = await transporter.sendMail({
      from: "Leave Application System",
      to,
      subject,
      text,
    });

    if (!info || !info.messageId) {
      throw new Error("Failed to send email.");
    }
    if (info) {
      console.log("✅ Email sent successfully", info);

    }

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("❌ Email Error");
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORTMAILER || 3005;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});