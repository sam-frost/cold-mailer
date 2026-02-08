const path = require("path");
const { google } = require("googleapis");
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CREDENTIALS_FILE = path.join(__dirname, "credentials.json");

// Buffer to hold contacts before writing
const contactBuffer = [];
const BATCH_SIZE = 10; // Change this to the number of contacts per batch

// Google Sheets append function
async function writeToGoogleSheets(values) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_FILE,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Contacts!A:D", // Make sure the sheet has 4 columns
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    console.log(`Batch of ${values.length} contacts written to Google Sheets`);
    return { success: true };
  } catch (error) {
    console.error("Error writing batch to Google Sheets:", error);
    return { success: false, error: error.message };
  }
}

// Add contacts to buffer and write if threshold reached
async function addContactsBuffered(newContacts) {
  // Normalize input to array
  if (!Array.isArray(newContacts)) newContacts = [newContacts];

  // Push new contacts into buffer
  contactBuffer.push(
    ...newContacts.map((c) => [
      new Date().toISOString().split("T")[0], // Date first
      c.name || "",
      c.company || "",
      c.email || "",
    ]),
  );

  // If buffer has enough contacts, write to Sheets
  if (contactBuffer.length >= BATCH_SIZE) {
    const batch = contactBuffer.splice(0, BATCH_SIZE); // Remove first BATCH_SIZE items
    await writeToGoogleSheets(batch);
  }
}

// Optional: force flush remaining contacts at the end
async function flushContacts() {
  if (contactBuffer.length > 0) {
    const remaining = contactBuffer.splice(0, contactBuffer.length);
    await writeToGoogleSheets(remaining);
  }
}

// Flush on server shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received: flushing contacts before exit...");
  await flushContacts();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received: flushing contacts before exit...");
  await flushContacts();
  process.exit(0);
});

process.on("exit", async () => {
  console.log("Process exiting: flushing contacts...");
  await flushContacts();
});

module.exports = { addContactsBuffered, flushContacts };
