const express = require("express");
const path = require("path");
require("dotenv").config();
const { sendMail } = require("./mailer");
const { subjectTemplate, bodyTemplate } = require("./message");
const { addContactsBuffered } = require("./excel");

const app = express();
const PORT = 8888;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Optional: force index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Single endpoint
app.post("/submit", async (req, res) => {
  const { emails, companyName, position } = req.body;

  // Basic validation
  if (
    !Array.isArray(emails) ||
    emails.length === 0 ||
    !companyName ||
    !position
  ) {
    return res.status(400).json({
      error: "emails (array), companyName, and position are required",
    });
  }

  // Optional: validate email format
  const invalidEmails = emails.filter(
    (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  );

  if (invalidEmails.length > 0) {
    return res.status(400).json({
      error: "Invalid email(s) found",
      invalidEmails,
    });
  }

  // Do whatever you want here (store in DB, send emails, etc.)
  console.log("Company:", companyName);
  console.log("Position:", position);
  console.log("Emails:", emails);

  const subject = subjectTemplate({
    company: companyName,
  });

  const results = [];

  for (const email of emails) {
    const html = bodyTemplate({
      recipientName: email.split("@")[0], // simple personalization
      position,
      company: companyName,
    });

    const result = await sendMail(email, subject, html);
    addContactsBuffered([
      {
        name: email.split("@")[0],
        email,
        company: companyName,
      },
    ]);

    results.push({ email, ...result });
  }

  res.status(200).json({
    message: "Data received successfully",
    data: {
      companyName,
      position,
      emails,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
