// /cartridges/logicPlusV1.js

module.exports = {
  name: "Logic+ v1",
  description: "Applies basic logic validation and ethical heuristics.",
  version: "1.0.0",
  async process(input, context) {
    if (typeof input !== "string") return input;

    // Minimal logic check: flag vague phrases
    let modified = input;

    const flags = ["make it better", "do your best", "you know what I mean"];
    const clarifications = {
      "make it better": "please improve it according to X criteria",
      "do your best": "optimize for success using specific metrics",
      "you know what I mean": "restate intent clearly",
    };

    for (const phrase of flags) {
      if (input.includes(phrase)) {
        modified = modified.replace(phrase, clarifications[phrase]);
      }
    }

    return modified;
  },
};