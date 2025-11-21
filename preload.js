const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
searchVerse: (query) => ipcRenderer.invoke('search-verse', query)
});