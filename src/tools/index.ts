// 📦 Importar todas las herramientas
import { searchVideoTool } from "./basic/index";
import { searchChannelTool } from "./elicitations/index";


// 🏭 Función que crea e instancia todas las tools
export const getTools = () => [
    searchVideoTool,
    searchChannelTool,
];
