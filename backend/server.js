require("dotenv").config(); // Load environment variables from .env

const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { ImapFlow } = require("imapflow");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const { simpleParser } = require("mailparser");
const { v4: uuidv4 } = require("uuid"); // Add UUID package for generating random IDs

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TWILIO TEXT/VOICE
const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

if (
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_PHONE_NUMBER
) {
  console.error("Missing Twilio credentials. Check your .env file.");
  process.exit(1);
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY;
const apiKeySecret = process.env.TWILIO_API_SECRET;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioAppSid = process.env.TWILIO_APP_SID; // Get this from Twilio

const twilioClient = twilio(accountSid, twilioAuthToken);

const server = app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

// FOR SMS

app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Missing 'to' or 'message field'" });
  }

  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });
    console.log("SMS Sent!", response);

    res.status(200).json({ success: true, message: "SMS Sent" });
  } catch (error) {
    console.error("Twilio Error - ", error);
    res.status(500).json({ error: "SMS failed to send to recipient" });
  }
});

app.get("/get-sms", async (req, res) => {
  try {
    const messages = await twilioClient.messages.list(); // Fetch the latest 10 messages
    const inboundMessage = messages.filter(
      (msg) => msg.direction === "inbound"
    );
    res.status(200).json({
      inboundMessage,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      error: "Failed to retrieve SMS messages",
      details: error.message,
    });
  }
});

app.get("/get-single-sms/:sid", async (req, res) => {
  const { sid } = req.params; // Get SID from the URL

  try {
    const message = await twilioClient.messages(sid).fetch(); // Fetch the specific message
    res.status(200).json({ message }); // Send response
  } catch (error) {
    console.error("Error fetching single SMS:", error);
    res.status(500).json({ error: "Failed to retrieve SMS message" });
  }
});

// FOR CALLS

app.get("/token", (req, res) => {
  const identity = "user_100"; // Unique user identity

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twilioAppSid,
    incomingAllow: true,
  });

  const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
    identity,
  });
  token.addGrant(voiceGrant);

  res.json({ identity, token: token.toJwt() });
});


// Handle an outgoing call request
app.post("/outgoing-call", async (req, res) => {
  const { to } = req.body;

  try {
    // Create a call using Twilio
    const call = await twilioClient.calls.create({
      from: twilioPhoneNumber,
      to,
      url: "https://demo.twilio.com/docs/voice.xml", // Webhook to handle call updates
      statusCallback: "https://4704-180-190-251-150.ngrok-free.app/call-status", // URL for call status updates
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"], // Real-time events
    });

    // Send the call SID back to the frontend
    res.json({ success: true, callSid: call.sid });

    // Notify WebSocket clients that the call is starting
    broadcastToClients("Calling...");
  } catch (error) {
    console.error("Error initiating call", error);
    res.status(500).json({ success: false, message: "Error making call" });
  }
});

// Handle incoming call (optional)
app.post("/incoming", (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say("Hello! You have an incoming call.");
  twiml.play({}, 'https://demo.twilio.com/docs/classic.mp3');
  twiml.dial(twilioPhoneNumber);
  res.type("text/xml");
  res.send(twiml.toString());
});

app.post("/call-status", (req, res) => {
  // Log the entire request body to understand the format
  console.log("Call status update received:", req.body);

  // If CallStatus is undefined, check what other data is being sent
  const callStatus = req.body.CallStatus; // "initiated", "ringing", "answered", "completed"

  console.log(callStatus)

  // Check if CallStatus is missing
  if (!callStatus) {
    console.error("CallStatus is missing from the callback!");
    console.log("Request body contents:", req.body);
  }

  // Broadcast the status update to WebSocket clients
  broadcastToClients(callStatus);
  broadcastToClients(req.body.CallsId);
  broadcastToClients(req.body.to);

  // Send an acknowledgment to Twilio
  res.status(200).send("Status update received");
});

app.post("/hangup", async (req, res) => {
  const { callSid } = req.body;

  try {
    await twilioClient.calls(callSid).update({ status: "completed" });
    res.json({ success: true, message: "Call ended successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error ending call" });
  }
});

// EMAIL

// Google Authentication
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");
const upload = multer({ dest: "uploads/" });

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error("Credentials file not found at", CREDENTIALS_PATH);
  process.exit(1);
}

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if token file exists
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);

    // Check if the token is expired and refresh it if needed
    if (oAuth2Client.isTokenExpiring()) {
      console.log("Token is expired, refreshing...");
      const newTokens = await oAuth2Client.refreshAccessToken();
      const newAccessToken = newTokens.credentials.access_token;

      // Save the new access token
      oAuth2Client.setCredentials({
        access_token: newAccessToken,
        refresh_token: token.refresh_token, // Keep the original refresh token
        expiry_date: newTokens.credentials.expiry_date,
      });
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(oAuth2Client.credentials));
      console.log("Token refreshed successfully.");
    }
  } else {
    // If no token exists, go through the OAuth flow to get one
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://mail.google.com/",
      ],
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const code = await getCodeFromUser();
    console.log("Authorization code received:", code);

    const { tokens } = await oAuth2Client.getToken(decodeURIComponent(code));
    console.log("Tokens received:", tokens);

    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  }

  return oAuth2Client;
}

function getCodeFromUser() {
  return new Promise((resolve) => {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      resolve(code);
    });
  });
}

async function fetchLatestEmails() {
  const auth = await authorize();
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      accessToken: auth.credentials.access_token,
    },
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    let emails = [];
    try {
      const uidRange = `${client.mailbox.exists - 4}:*`;
      const messages = await client.fetch(uidRange, {
        source: true,
        envelope: true,
      });
      for await (const message of messages) {
        const parsed = await simpleParser(message.source);
        emails.push({
          id: uuidv4(), // Generate a unique ID
          uid: message.uid,
          from: parsed.from.text,
          to: parsed.to.text,
          subject: parsed.subject,
          date: parsed.date,
          text: parsed.text,
          html: parsed.html,
        });
      }
    } finally {
      lock.release();
    }
    await client.logout();
    return emails;
  } catch (err) {
    console.error("Error fetching latest emails:", err);
    throw err;
  }
}

app.get("/fetch-emails", async (req, res) => {
  try {
    const storedEmails = await fetchLatestEmails(); // Correctly store emails
    console.log(`Stored Emails Count: ${storedEmails.length}`); // Debugging line
    res.json(storedEmails);
  } catch (err) {
    res.status(500).send("Error fetching emails");
  }
});

app.get("/email/:id", async (req, res) => {
  try {
    const auth = await authorize();
    const client = new ImapFlow({
      host: "imap.gmail.com",
      port: 993,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        accessToken: auth.credentials.access_token,
      },
    });

    await client.connect();
    const lock = await client.getMailboxLock("INBOX");

    try {
      const uid = Number(req.params.id); // Convert id to number
      console.log(`Fetching email with UID: ${uid}`);

      const messages = client.fetch({ uid }, { source: true, envelope: true });

      let email = null;
      let attachments = [];

      for await (const message of messages) {
        const parsed = await simpleParser(message.source);

        // If the email contains attachments
        if (parsed.attachments && parsed.attachments.length > 0) {
          attachments = parsed.attachments.map((attachment) => {
            return {
              filename: attachment.filename,
              contentType: attachment.contentType,
              contentDisposition: attachment.contentDisposition,
              size: attachment.size,
              content: attachment.content.toString("base64"), // Encode attachment content in base64
            };
          });
        }

        email = {
          uid: message.uid,
          from: parsed.from.text,
          to: parsed.to.text,
          subject: parsed.subject,
          date: parsed.date,
          text: parsed.text,
          html: parsed.html,
          attachments,
        };
      }

      lock.release();
      await client.logout();

      if (email) {
        res.json(email);
      } else {
        res.status(404).send("Email not found");
      }
    } catch (error) {
      lock.release();
      throw error;
    }
  } catch (error) {
    console.error("Error fetching email:", error);
    res.status(500).send("Internal server error");
  }
});

// SMTP
// email sending
app.post("/send-email", upload.single("attachment"), async (req, res) => {
  try {
    const auth = await authorize();
    const accessToken = auth.credentials.access_token;
    const { to, subject, message } = req.body;
    const attachment = req.file; // The uploaded file

    console.log(req.file);

    // Nodemailer transporter with OAuth2 authentication
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: auth._clientId,
        clientSecret: auth._clientSecret,
        refreshToken: auth.credentials.refresh_token,
        accessToken: accessToken,
      },
    });

    // Prepare email options
    let mailOptions = {
      from: "edzerdionido10@gmail.com",
      to,
      subject,
      text: message,
      html: message,
      attachments: attachment
        ? [
            {
              filename: attachment.originalname,
              path: attachment.path,
            },
          ]
        : [],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Cleanup: Delete the file after sending the email
    if (attachment) fs.unlinkSync(attachment.path);

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// websockets

function broadcastToClients(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "status",
          message: message,
        })
      );
    }
  });
}

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Initial message to client when the WebSocket is connected
  ws.send(
    JSON.stringify({
      type: "status",
      message: "Waiting for call to be initiated",
    })
  );

  ws.on("message", (message) => {
    console.log("Received from client:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

