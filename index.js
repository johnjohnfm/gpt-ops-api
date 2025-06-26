// index.js — Main server entry for GPT-Ops API

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const validateInstruction = require("./validators/validateInstruction"); // Make sure this path is valid!
const { callGPT } = require("./utils/gptWrapper");
const { parseGPTResponse } = require("./utils/parseResponse");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Validate Instruction Route
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
      useAI
    } = req.body;

    // ✅ Ensure required fields exist
    if (!instruction || !mode || !target_role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Run validation through LogicPlus or fallback
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

    // Optionally enhance with GPT
    if (useAI) {
      const gptText = await callGPT(instruction, { temperature: 0.5 });
      const gptResult = parseGPTResponse(gptText);
      return res.json({ ...gptResult, validator: validation });
    }

    res.json({ validator: validation });

  } catch (error) {
    console.error("Validation Error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ GPT-Ops API running on port ${PORT}`);
});
