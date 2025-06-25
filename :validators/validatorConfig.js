// validatorConfig.js
export const ValidatorModes = {
  QUICK: "quick",
  STRICT: "strict",
  PRO: "pro"
};

export const FailureTypes = {
  SOFT_FLAG: "soft_flag",
  HARD_FAIL: "hard_fail",
  MANUAL: "manual",
  FALLBACK: "fallback"
};

export const DefaultSettings = {
  scoringThreshold: 0.75,
  enhancementEnabled: true,
  fallbackToGPT: true
};