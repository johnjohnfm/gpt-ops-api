// ✖ Logic+ Validator — Schema v1.0
// Modular Diagnostic Engine for GPT OPS

function runLogicDiagnostics(text = "") {
  const results = {
    input: text,
    issues: [],
    score: 1.0,
    summary: "",
    tags: []
  };

  // ────── NODE A: Scope Violation
  if (text.length < 10 || text.length > 2000) {
    results.issues.push("A: Instruction may be too short or too long to be operationally scoped.");
    results.score -= 0.1;
    results.tags.push("scope");
  }

  // ────── NODE B: Missing or Confused Claims
  if (!/[.?!]$/.test(text.trim()) || !text.match(/\b(should|must|is|are|means|refers)\b/)) {
    results.issues.push("B: Instruction lacks assertive claims or may not express declarative intent.");
    results.score -= 0.1;
    results.tags.push("claims");
  }

  // ────── NODE C: Contradiction Check (simplified)
  if (/not.*\bshould\b.*not/i.test(text) || /always.*never|never.*always/i.test(text)) {
    results.issues.push("C: Contradictory terms detected (e.g., 'always' vs. 'never').");
    results.score -= 0.1;
    results.tags.push("contradiction");
  }

  // ────── NODE D: Category Error
  if (/color of sound|taste of justice|weigh the truth/i.test(text)) {
    results.issues.push("D: Potential category error (e.g., mixing sensory or abstract categories).");
    results.score -= 0.1;
    results.tags.push("category_error");
  }

  // ────── NODE E: Missing Premises
  if (/therefore|thus|hence/i.test(text) && !text.match(/\b(if|because|given that)\b/i)) {
    results.issues.push("E: Conclusion detected without clear premises.");
    results.score -= 0.1;
    results.tags.push("missing_premises");
  }

  // ────── NODE F: Fallacy Check (basic)
  if (/everyone knows|obviously|as you can see/i.test(text)) {
    results.issues.push("F: Possible appeal to popularity or assumption of agreement.");
    results.score -= 0.1;
    results.tags.push("fallacy");
  }

  // ────── NODE G: Ethical Violation (soft flag)
  if (/kill|destroy|enslave/i.test(text) && !/metaphor/i.test(text)) {
    results.issues.push("G: Contains potentially unethical directive or harmful command.");
    results.score -= 0.15;
    results.tags.push("ethics");
  }

  // ────── NODE H: Ambiguity
  if ((text.match(/\b(it|they|this|that|thing|stuff)\b/g) || []).length > 3) {
    results.issues.push("H: Ambiguous references detected (e.g., 'it', 'this', 'thing').");
    results.score -= 0.1;
    results.tags.push("ambiguity");
  }

  // ────── NODE I: Tone/Assumption Bias
  if (/lazy|idiotic|just do it|obviously wrong/i.test(text)) {
    results.issues.push("I: Potentially biased or condescending tone detected.");
    results.score -= 0.1;
    results.tags.push("tone");
  }

  // Summary logic
  if (results.issues.length === 0) {
    results.summary = "No major logical issues detected. Instruction appears structurally sound.";
    results.tags.push("valid");
  } else {
    results.summary = `Detected ${results.issues.length} issue(s) with logical or semantic structure.`;
    results.score = Math.max(results.score, 0); // Never go below 0
  }

  return results;
}

module.exports = { runLogicDiagnostics };