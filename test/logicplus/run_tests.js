// run_tests.js — LogicPlus v1 Test Harness
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajvFormats = require("ajv-formats");
const { diffWordsWithSpace } = require("diff");

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

// ✅ Replace stub with actual cartridge import
const logicPlus = require("../../core/engine/cartridges/logicplus/logicplus.v1");

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

    const result = await logicPlus(input);  // assuming async; or remove await if sync

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

// Markdown Report Generator (unchanged)
function generateMarkdown(results) { /* ... */ }

// Run CLI
runTests();
