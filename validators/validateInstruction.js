// /validators/validateInstruction.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function validateInstruction({
  instruction,
  failure_type,
  mode,
  context_tags,
  desired_fix_type,
  language_register,
  target_role,
  useAI = false
}) {
  if (!useAI) {
    return {
      original_instruction: instruction,
      enhanced_instruction: null,
      rationale: "AI not used. Basic validation only.",
      recovered_node_score: 0,
    };
  }

  const messages = [
    {
      role: "system",
      content: `You are a semantic instruction validator and enhancer.`,
    },
    {
      role: "user",
      content: `Analyze the instruction: "${instruction}"
      
- Type of failure: ${failure_type}
- Desired fix: ${desired_fix_type}
- Context tags: ${context_tags.join(', ')}
- Mode: ${mode}
- Target Role: ${target_role}
- Language Style: ${language_register}

Return an improved version, explanation, and score (0–1).`,
    },
  ];

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.4,
  });

  const reply = chat.choices[0]?.message?.content;

  // TEMP: Fallback parser until structured formatting added
  const enhanced_instruction = reply?.match(/"(.+?)"/)?.[1] || "No enhanced instruction found.";
  const rationale = reply;
  const recovered_node_score = 1.0;

  return {
    original_instruction: instruction,
    enhanced_instruction,
    rationale,
    recovered_node_score,
  };
}

module.exports = validateInstruction;
