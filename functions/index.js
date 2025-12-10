const functions = require("firebase-functions");
const fetch = require("node-fetch");
require("dotenv").config();

exports.henrikAI = functions
  .runWith({
    memory: "256MB",
    timeoutSeconds: 30
  })
  .https.onRequest(async (req, res) => {

    // 🔥 Fix CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send(""); // Preflight OK
    }

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).send({ error: "No prompt provided" });

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: prompt
        }),
      });

      const data = await response.json();
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "OpenAI request failed" });
    }
  });
