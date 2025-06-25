// logger.js
export function logValidation(input, result) {
  console.log(`[${new Date().toISOString()}] Validation Run:`);
  console.log("Input:", input);
  console.log("Output:", result);
}