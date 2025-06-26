// run_tests.js — LogicPlus v1 Test Harness
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajvFormats = require("ajv-formats");
const { diffWordsWithSpace } = require("diff");

// Import LogicPlus cartridge directly
const logicPlus = require("../../core/engine/cartridges/logicplus/logicplus.v1");

const ajv = new Ajv({ allErrors: true, strict: false });
ajvFormats(ajv);

// Load Schemas
const inputSchema = require("../../schemas/logicplus/logicplus.v1.input.json");
const outputSchema = require("../../schemas/logicplus/logicplus.v1.output.json");

// Load Test Cases + Expected Results
const testCases = require("./test_cases.json");
const expectedOutputs = require("./expected_outputs.json");

// Fuzzy string match helper
function fuzzyMatch(a, b) {
  const clean = (s) => s.toLowerCase().replace(/[^\w\s]/g, "").trim();
  return clean(a) === clean(b) || diffWordsWithSpace(clean(a), clean(b)).length < 5;
}

// Run Tests
async function runTests() {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const input = testCases[i];
    const expected = expectedOutputs[i];

    const inputValid = ajv.validate(inputSchema, input);
    if (!inputValid) {
      results.push({
        case: i + 1,
        status: "FAIL",
        reason: "Input schema invalid",
        errors: ajv.errors
      });
      continue;
    }

    const result = logicPlus(input);
    const outputValid = ajv.validate(outputSchema, result);

    const pass =
      outputValid &&
      result.status === expected.status &&
      result.violations.toString() === expected.violations.toString() &&
      fuzzyMatch(result.rationale, expected.rationale) &&
      fuzzyMatch(result.improved_instruction, expected.improved_instruction);

    results.push({
      case: i + 1,
      status: pass ? "PASS" : "FAIL",
      reason: pass ? "✓" : "Mismatch or schema error",
      outputValid,
      input,
      result,
      expected,
      errors: outputValid ? null : ajv.errors
    });
  }

  generateMarkdown(results);
}

// Markdown Report Generator
function generateMarkdown(results) {
  const lines = [
    "# 🧪 LogicPlus v1 — Test Report",
    `**Date:** ${new Date().toISOString()}`,
    "",
    "| Case | Status | Reason |",
    "|------|--------|--------|"
  ];

  results.forEach((r) => {
    lines.push(`| ${r.case} | ${r.status} | ${r.reason} |`);
  });

  lines.push("", "## Detailed Results");
  results.forEach((r) => {
    lines.push(`\n### Test Case ${r.case} — ${r.status}`);
    lines.push(`**Input:**\n\`\`\`json\n${JSON.stringify(r.input, null, 2)}\n\`\`\``);
    lines.push(`**Expected Output:**\n\`\`\`json\n${JSON.stringify(r.expected, null, 2)}\n\`\`\``);
    lines.push(`**Actual Result:**\n\`\`\`json\n${JSON.stringify(r.result, null, 2)}\n\`\`\``);
    if (r.errors) {
      lines.push(`**Schema Errors:**\n\`\`\`json\n${JSON.stringify(r.errors, null, 2)}\n\`\`\``);
    }
  });

  fs.writeFileSync(path.join(__dirname, "test_report.md"), lines.join("\n"), "utf8");
  console.log("✅ Test report generated: test_report.md");
}

// Run CLI
runTests();