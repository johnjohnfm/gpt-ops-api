// validators/validateInstruction.js

function validateInstruction(text) {
  const failures = [];

  if (!text || text.length < 10) {
    failures.push({ type: "hard_fail", reason: "Too short or empty." });
  }

  if (/\b(helpful|clear|good)\b/i.test(text)) {
    failures.push({ type: "soft_flag", reason: "Contains vague or subjective terms." });
  }

  // Add more semantic checks here...

  return failures.length > 0 ? failures : null;
}

module.exports = { validateInstruction };