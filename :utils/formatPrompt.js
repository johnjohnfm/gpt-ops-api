// formatPrompt.js
export function buildEnhancementPrompt(data) {
  return `
You are a GPT-Ops Logic+ Validator. A flagged instruction has been sent for improvement.

---
Instruction: ${data.instruction}

Failure Type: ${data.failure_type}
Desired Fix: ${data.desired_fix_type}
Tags: ${data.context_tags.join(", ")}
Role: ${data.target_role}
Register: ${data.language_register}
Mode: ${data.mode}
---

Return ONLY a JSON object:
{
  "original_instruction": "...",
  "enhanced_instruction": "...",
  "rationale": "...",
  "recovered_node_score": 1.0
}`.trim();
}