"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTools = void 0;
// 📦 Importar todas las herramientas
const index_1 = require("./basic/index");
const index_2 = require("./elicitations/index");
const index_3 = require("./sampling/index");
// 🏭 Función que crea e instancia todas las tools
const getTools = () => [
    index_1.searchVideoTool,
    index_2.searchChannelTool,
    index_3.generateVideoTitleTool,
];
exports.getTools = getTools;
//# sourceMappingURL=index.js.map