// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("klinesCache", {
  save: (sym, interval, candles) => ipcRenderer.invoke("klines:save", sym, interval, candles),
  load: (sym, interval) => ipcRenderer.invoke("klines:load", sym, interval),
  list: (sym) => ipcRenderer.invoke("klines:list", sym),
  clearOne: (sym, interval) => ipcRenderer.invoke("klines:clearOne", sym, interval),
  clearAll: (sym) => ipcRenderer.invoke("klines:clearAll", sym),
});
