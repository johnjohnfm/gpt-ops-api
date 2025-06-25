export function parseGPTResponse(response) {
  try {
    const parsed = JSON.parse(response);
    return parsed;
  } catch (e) {
    return { enhanced_instruction: response };
  }
}
