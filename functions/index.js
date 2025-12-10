const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true }); // allow all origins or specify your domain
require("dotenv").config();

exports.henrikAI = functions.https.onRequest((req, res) => {
  cors(req, res, async () => { // wrap your code with cors
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
});
