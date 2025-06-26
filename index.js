// index.js — Main server entry for GPT-Ops API

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ✅ Load env variables
dotenv.config();

// ✅ Import LogicPlus validation cartridge
const validateInstruction = require("./core/engine/cartridges/logicplus/validateInstruction");

// ✅ Optional GPT Assist
const { callGPT } = require("./utils/gptWrapper");
const { parseGPTResponse } = require("./utils/parseResponse");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ GPT-Ops API is live");
});

// ✅ Main validation route
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

  try {
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

    // ✅ Optional: enhance with GPT
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
  } catch (err) {
    res.status(500).json({ error: "Validation failed", details: err.message });
  }
});

// ✅ Launch server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ GPT-Ops API running on port ${PORT}`);
});
