// /core/cartridgeRegistry.js

// Central list of all loaded cartridges
const logicPlusV1 = require("../cartridges/logicPlusV1");

function getCartridges() {
  return [
    logicPlusV1,
    // Add more cartridges here, in desired execution order
    // e.g. require("../cartridges/UXPolisher"),
    //      require("../cartridges/CreativeLogic")
  ];
}

module.exports = { getCartridges };