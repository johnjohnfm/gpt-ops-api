// /core/processInstruction.js

const { getCartridges } = require("./cartridgeRegistry");

async function processInstruction(input, config = {}) {
  const cartridges = getCartridges();

  let context = {
    original: input,
    current: input,
    history: [],
    config,
  };

  for (const cartridge of cartridges) {
    if (typeof cartridge.process === "function") {
      const result = await cartridge.process(context.current, context);
      context.history.push({
        name: cartridge.name,
        output: result,
      });
      context.current = result;
    } else {
      console.warn(`Skipping invalid cartridge: ${cartridge.name}`);
    }
  }

  return {
    finalOutput: context.current,
    transformationHistory: context.history,
  };
}

module.exports = { processInstruction };