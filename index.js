// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const validateInstruction = require("./validators/validateInstruction"); // must be correct
const { callGPT } = require("./utils/gptWrapper");
const { parseGPTResponse } = require("./utils/parseResponse");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/validate", async (req, res) => {
  try {
    const {
      instruction,
      failure_type,
      context_tags,
      desired_fix_type,
      language_register,
      target_role,
      mode,
      useAI = false
    } = req.body;

    if (!instruction || !mode || !target_role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validation = await validateInstruction({
      instruction,
      failure_type,
      mode,
      context_tags,
      desired_fix_type,
      language_register,
      target_role,
      useAI
    });

    if (useAI) {
      const gptText = await callGPT(instruction, { temperature: 0.5 });
      const gptResult = parseGPTResponse(gptText);
      return res.json({ validator: validation, gpt: gptResult });
    }

    res.json({ validator: validation });
  } catch (err) {
    console.error("Validation failure:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ GPT-Ops API running on port ${PORT}`));
