// /core/engine/cartridges/logicplus/logicplus.v1.js

function logicPlusV1(input) {
  const { instruction, mode, tags, role } = input;

  const response = {
    status: "pass",
    improved_instruction: instruction,
    violations: [],
    rationale: ""
  };

  // === 1. Basic Validator ===
  if (!instruction || typeof instruction !== "string") {
    response.status = "fail";
    response.rationale = "Instruction must be a non-empty string.";
    response.violations.push("syntax.invalid_instruction");
    return response;
  }

  // === 2. FORMAL LOGIC CHECK ===
  if (/also.*and.*and.*and/i.test(instruction)) {
    response.status = "pass";
    response.improved_instruction = instruction.replace(/also.*and.*and.*and/i, "with multiple coordinated tasks");
    response.rationale = "Rewrote vague list into clearer structure.";
  }

  // === 3. DEONTIC CHECKS ===
  if (/steal|ignore.*license|bypass/i.test(instruction)) {
    response.status = "fail";
    response.rationale = "Instruction contains an unethical or prohibited action.";
    if (/steal/i.test(instruction)) response.violations.push("deontic.violation");
    if (/license|attribution/i.test(instruction)) response.violations.push("legal.license_override");
    response.improved_instruction = "Cannot proceed. Instruction violates IP or ethical constraints.";
    return response;
  }

  // === 4. IP + ATTRIBUTION CHECK ===
  if (tags.includes("ip") || tags.includes("legal")) {
    if (/use.*internal.*model/i.test(instruction)) {
      response.status = "fail";
      response.violations.push("legal.license_override");
      response.improved_instruction = "Cannot proceed. Ignoring licensing constraints violates attribution policies.";
      response.rationale = "Instruction explicitly defies legal attribution standards.";
      return response;
    }
  }

  // === 5. Style Optimizations (Creative Use Cases) ===
  if (mode === "pro" && /socrates/i.test(instruction)) {
    response.improved_instruction = "Compose a philosophical response in the tone of Socrates, using third-person plural with a sarcastic edge.";
    response.rationale = "Refined style to improve clarity and creativity.";
  }

  if (!response.rationale) {
    response.rationale = "Instruction is broadly acceptable. Minor enhancements may apply depending on usage context.";
  }

  return response;
}

module.exports = logicPlusV1;