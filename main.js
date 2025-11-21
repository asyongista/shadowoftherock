const {
    app,
    BrowserWindow,
    ipcMain, 
    Menu
} = require('electron');
const path = require('path');
const xlsx = require('xlsx');


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    
    // Hide default menu
    Menu.setApplicationMenu(null);

    win.loadFile('index.html');
}


app.whenReady().then(() => {
    createWindow();


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


// IPC handler to search the XLSX file
ipcMain.handle('search-verse', async (event, query) => {
    try {
        const workbook = xlsx.readFile('kjv.xlsx');
             
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, {
            header: 1
        });

        console.log("data",data)


        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (row[0] && row[0].toString().trim() === query.trim()) {
                return row[1] || 'No content found in column B.';
            }
        }
        return 'Verse not found.';
    } catch (err) {
        return 'Error reading file: ' + err.message;
    }
});




// ========== preload.js (Electron Preload Script) ==========
const {
    contextBridge,
    ipcRenderer
} = require('electron');


contextBridge.exposeInMainWorld('api', {
    searchVerse: (query) => ipcRenderer.invoke('search-verse', query)
});