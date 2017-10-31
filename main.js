import {app, globalShortcut} from 'electron';
import {BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // devtools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    globalShortcut.register('CommandOrControl+D', () => {
        mainWindow.close();
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});
