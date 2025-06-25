// validators/scoreInstruction.js

function scoreInstruction(text) {
  let score = 1.0;

  if (text.length < 25) score -= 0.3;
  if (/\b(helpful|good|clear)\b/i.test(text)) score -= 0.2;

  return Math.max(score, 0);
}

module.exports = { scoreInstruction };