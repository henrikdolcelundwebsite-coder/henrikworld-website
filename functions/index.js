// Load environment variables from .env
require("dotenv").config();

const functions = require("firebase-functions");
const fetch = require("node-fetch"); // make sure this is node-fetch@2
const cors = require("cors")({ origin: true }); // allow all origins

// Get your OpenAI API key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.henrikAI = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return res.status(204).send(""); // No Content
    }

    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).send({ error: "No prompt provided" });

    try {
      // Call OpenAI API
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: prompt
        }),
      });

      const data = await response.json();

      // Send back the AI response
      res.status(200).send(data);

    } catch (err) {
      console.error("OpenAI request failed:", err);
      res.status(500).send({ error: "OpenAI request failed" });
    }

  });
});
