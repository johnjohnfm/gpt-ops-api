// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/gpt-assist", async (req, res) => {
  try {
    const {
      instruction,
      failure_type,
      context_tags,
      desired_fix_type,
      language_register,
      target_role,
      mode,
    } = req.body;

    const prompt = `
You are a GPT-Ops Logic+ Assistant. Improve the following instruction:

---
Instruction: ${instruction}

Failure Type: ${failure_type}
Desired Fix: ${desired_fix_type}
Context Tags: ${context_tags.join(", ")}
Target Role: ${target_role}
Language Register: ${language_register}
Mode: ${mode}
---

Return ONLY a valid JSON object in the following schema:
{
  "original_instruction": "...",
  "enhanced_instruction": "...",
  "rationale": "...",
  "recovered_node_score": 1.0
}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a strict validator and editor for GPT-based AI instruction design.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const responseText = completion.choices[0].message.content;

    try {
      const parsed = JSON.parse(responseText);
      res.status(200).json(parsed);
    } catch (err) {
      console.error("JSON parse failed:", responseText);
      res.status(500).json({
        error: "Failed to parse GPT response.",
        raw: responseText,
      });
    }
  } catch (error) {
    console.error("GPT Assist Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`GPT Assist running on port ${PORT}`);
});
