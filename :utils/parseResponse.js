// utils/parseResponse.js

function parseGPTResponse(rawText, originalInstruction = "") {
  // A basic fallback — you can expand this with smarter NLP later
  return {
    original_instruction: originalInstruction,
    enhanced_instruction: rawText,
    rationale: "Enhanced via GPT based on detected issue or user request.",
    recovered_node_score: 1.0
  };
}

module.exports = { parseGPTResponse };