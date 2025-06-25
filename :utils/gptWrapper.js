// utils/gptWrapper.js
const fetch = require("node-fetch");

async function callGPT(prompt, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = options.model || "gpt-4";
  const temperature = options.temperature ?? 0.2;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant that revises ambiguous or unclear instructions based on project goals and role-specific tone." },
        { role: "user", content: prompt }
      ],
      temperature
    })
  });

  if (!response.ok) {
    throw new Error(`GPT API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

module.exports = { callGPT };