const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim()).filter(Boolean)
  : [];

if (!GMAIL_USER || !GMAIL_PASS || ADMIN_EMAILS.length === 0) {
  console.warn(
    "Email notifier is not fully configured. Set GMAIL_USER, GMAIL_PASS, and ADMIN_EMAILS in your .env file."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

app.post("/api/notify-leave", async (req, res) => {
  if (!GMAIL_USER || !GMAIL_PASS || ADMIN_EMAILS.length === 0) {
    return res.status(500).json({
      error:
        "Notification service not configured. Please set GMAIL_USER, GMAIL_PASS, and ADMIN_EMAILS.",
    });
  }

  const {
    employee_id,
    leave_type,
    start_date,
    end_date,
    days_requested,
    reason,
    approved_by,
  } = req.body || {};

  if (!employee_id || !leave_type || !start_date || !end_date || !days_requested) {
    return res.status(400).json({
      error: "Missing required leave application fields.",
    });
  }

  const subject = "New leave application submitted";
  const text = `A new leave application was submitted.

Employee ID: ${employee_id}
Leave type: ${leave_type}
Start date: ${start_date}
End date: ${end_date}
Days requested: ${days_requested}
Approved by: ${approved_by || "Not assigned"}

Reason:
${reason || "No reason provided."}`;

  try {
    await transporter.sendMail({
      from: GMAIL_USER,
      to: ADMIN_EMAILS,
      subject,
      text,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending leave notification email:", error);
    return res.status(500).json({
      error: "Unable to send email notification.",
      details: error.message,
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Leave notification server listening on port ${port}`);
});
