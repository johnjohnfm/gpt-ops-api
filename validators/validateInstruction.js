// /validators/validateInstruction.js
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * validateInstruction({ instruction, failure_type, mode, context_tags, desired_fix_type, language_register, target_role, useAI })
 * Returns validated/enhanced instruction object.
 */
async function validateInstruction({
  instruction,
  failure_type = "semantic",
  mode = "lint",
  context_tags = [],
  desired_fix_type = "clarify",
  language_register = "neutral",
  target_role = "SYSTEM",
  useAI = false,
}) {
  if (!useAI) {
    return {
      status: "pass",
      improved_instruction: instruction,
      violations: [],
      rationale: "AI not used; basic pass-through validation."
    };
  }
  // GPT powered validation
  const messages = [
    { role: "system", content: "You are a logic+ instruction validator." },
    {
      role: "user",
      content: `Instruction: "${instruction}"
- Failure_Type: ${failure_type}
- Mode: ${mode}
- Context_Tags: ${context_tags.join(",")}
- Desired_Fix: ${desired_fix_type}
- Language_Style: ${language_register}
- Target_Role: ${target_role}`
    }
  ];
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });
  const resp = chat.choices[0]?.message?.content || "";
  // TODO: parse JSON-format output properly; for now dumb fallback
  return {
    status: "pass",
    improved_instruction: instruction,
    violations: [],
    rationale: resp
  };
}

module.exports = validateInstruction;
