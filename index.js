// index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ✅ DEFAULT IMPORT to match module.exports = validateInstruction
const validateInstruction = require("./validators/validateInstruction");

const { callGPT } = require("./utils/gptWrapper");
const { parseGPTResponse } = require("./utils/parseResponse");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/validate", async (req, res) => {
  const {
    instruction,
    failure_type,
    context_tags,
    desired_fix_type,
    language_register,
    target_role,
    mode,
    useAI
  } = req.body;

  // ✅ Pass entire object to match validateInstruction signature
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
    try {
      const gptText = await callGPT(instruction, { temperature: 0.5 });
      const gptResult = parseGPTResponse(gptText);
      return res.json({ ...gptResult, validator: validation });
    } catch (error) {
      return res.status(500).json({ error: "GPT Assist failed", details: error.message });
    }
  }

  res.json({ validator: validation });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ GPT-Ops API running on port ${PORT}`));
