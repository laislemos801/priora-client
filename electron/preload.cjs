// Ponte segura entre o aplicativo desktop e a interface (contextIsolation ligado).
// A interface só enxerga `window.priora.apiUrl`; nada do Node é exposto.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("priora", {
  apiUrl: ipcRenderer.sendSync("priora:api-url"),
});
