const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

let mainWindow;
let server;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 900,
    minHeight: 650,
    title: '3008 Minimap',
    backgroundColor: '#10130f',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://github.com/')) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL('http://127.0.0.1:' + (process.env.PORT || 3000));
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  // The same-origin local server supplies the app UI and its /api endpoints.
  process.env.HOST = '127.0.0.1';
  process.env.PORT = process.env.PORT || '3000';
  server = require(path.join(__dirname, '..', 'server.js'));
  if (server.listening) createWindow();
  else server.once('listening', createWindow);
});

app.on('window-all-closed', () => {
  if (server && server.listening) server.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && server && server.listening) createWindow();
});
