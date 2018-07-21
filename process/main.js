const package = require('../package.json');
console.log('App starting...');
console.log('App Version', package.version);
console.log('Node Version', process.version);
console.log('Electron Version', process.versions.electron);
console.log('All versions', process.versions);
// const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');
// installExtension(VUEJS_DEVTOOLS)
//     .then((name) => console.log(`Added Extension:  ${name}`))
//     .catch((err) => console.log('An error occurred: ', err));
//------------------------------------------------------------------------------
// Downloader
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// Critical Error Case
//------------------------------------------------------------------------------
let autoUpdaterStarted = false;
const { autoUpdater } = require("electron-updater");
function startAutoUpdater() {
    if (!autoUpdaterStarted) {
        autoUpdaterStarted = true;
        autoUpdater.checkForUpdatesAndNotify();
        // autoUpdater.emit('checking-for-update');
    }
}
process.on('uncaughtException', function(error) {
    startAutoUpdater();
});
//------------------------------------------------------------------------------
// Electron Modules
//------------------------------------------------------------------------------
const electron = require('electron');
const {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    webContents,
    Tray,
    Menu,
    remote
} = electron
const path = require('path');
const url = require('url');
const fs = require('fs');

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'developement') {
    require('electron-reload')(path.join(__dirname, '../'));
}

//------------------------------------------------------------------------------
// External Modules
//------------------------------------------------------------------------------
// const AutoLaunch = require('auto-launch')

//------------------------------------------------------------------------------
// Other Modules
//------------------------------------------------------------------------------
// const keyboards = require('./data/keyboards.json')
const iconPath = path.join(__dirname, 'assets/images/icon-64x64.png');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
//------------------------------------------------------------------------------
// Variables
//------------------------------------------------------------------------------
let mainWindow;
let globalWindow;
let tray = null;
let mainWindowLoaded = false;
let trayObject = {
    title: package.productName + ' is running',
    message: package.productName + ' is running'
};
//------------------------------------------------------------------------------
// User Settings
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// App Methods
//------------------------------------------------------------------------------
function log(message) {
    console.log(message);
    mainWindow.webContents.send('toApp', { name: 'log', payload: message });
}
function createAll() {
    createMainWindow();
}

function initDefinitions() {

}

function createTrayIcon() {
    // // Tray icon
    // const menu = Menu.buildFromTemplate([
    //     { role: "quit" }, // "role": system prepared action menu
    // ])
    // tray = new Tray(iconPath)
    // tray.setToolTip(package.productName)
    // tray.setContextMenu(menu)
    // // tray.setToolTip("hello electrol")
    // //tray.setTitle("Tray Example") // macOS only
    //
    // // Events
    // tray.on('click', () => {
    //     mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    // })
}

function createMainWindow() {
    // Main window
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        // x: 0,
        // y: 0,
        // frame: false,
        // show: false,
        // transparent: true,
        // fullscreen: true,
        center: true,
        maximizable: true,
        resizable: true,
        // titleBarStyle: 'hidden', // macOS,
        icon: __dirname + '/assets/images/icon-32x32.png.png'
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // mainWindow.addDevToolsExtension('%LOCALAPPDATA%/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/4.1.4_0')
    mainWindow.webContents.on('did-finish-load dom-ready did-fail-load', () => {
        // mainWindowLoaded = true;
        startAutoUpdater();
        console.log('Started Auto Updater from main process');
    });

    globalShortcut.register('CommandOrControl+Shift+F12', () => {
        mainWindow.webContents.openDevTools();
    });
    // Events
    // mainWindow.on('closed', quit)
    // mainWindow.on('show', () => {
    //     tray.setHighlightMode('always')
    // })
    // mainWindow.on('hide', () => {
    //     tray.setHighlightMode('never')
    // })
    // mainWindow.webContents.openDevTools()
    // globalShortcut.register('CommandOrControl+Shift+I', () => {
    //     mainWindow.webContents.openDevTools()
    // })
    // globalShortcut.register('CommandOrControl+Shift+U', () => {
    //     globalWindow.webContents.openDevTools()
    // })
    // Init
    // mainWindow.focus()
    // mainWindow.minimize()
    // hideMain()
}

function quit() {
    // globalShortcut.unregisterAll()
    // mainWindow.close()
    // globalWindow.close()
    // tray = null
    mainWindow = null;
}


ipcMain.on('toElectron', function(e, event) {
    mainWindow.webContents.send('toApp', { name: "message", payload: "Hello from Electron" });
    switch (event.name) {
        case "log":
            console.log(event.payload);
            break;
    }
});

function minimize() {
    mainWindow.minimize();
}
function maximize() {
    mainWindow.maximize();
}
function close() {
    // hideMain();
}
function closeGlobal() {

}

//------------------------------------------------------------------------------
// App Events
//------------------------------------------------------------------------------
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'developement') {
        require('vue-devtools').install();
    }
    // protocol.unregisterProtocol('', () => {
    // setTimeout(function(){
    createAll();
    // },100)
    // })
});
// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createAll();
    }
});

app.on('before-quit', quit);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


//------------------------------------------------------------------------------
// Global Mode Methods
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Utilities
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Auto Launcher
//------------------------------------------------------------------------------
// let appAutoLauncher = new AutoLaunch({
//     name: package.productName,
//     path: app.getPath('exe'),
// })

// appAutoLauncher.enable()
// appAutoLauncher.isEnabled().then((isEnabled) => {
//     if (!isEnabled) appAutoLauncher.enable()
// })

//------------------------------------------------------------------------------
// Auto updates
//------------------------------------------------------------------------------

autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('toApp', { name: 'updater-checking-for-update', payload: '<span class="u-size:12">🤖</span> Checking for updates...' });
});
autoUpdater.on('update-available', info => {
    mainWindow.webContents.send('toApp', { name: 'updater-update-available', payload: '<span class="u-size:12">‍😄</span> Updates available.' });
});
autoUpdater.on('update-not-available', info => {
    mainWindow.webContents.send('toApp', { name: 'updater-no-update', payload: '<span class="u-size:12">💖</span> Up-to-date.' });
});
autoUpdater.on('error', err => {
    mainWindow.webContents.send('toApp', { name: 'updater-error', payload: `<span class="u-size:12">🤷</span> Error in auto-updater: ${err.toString()}` });
});
autoUpdater.on('download-progress', progressObj => {
    let percent = Math.round(progressObj.percent);
    // `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
    mainWindow.webContents.send('toApp', { name: 'updater-download-progress', payload: `<span class="u-size:12">👩‍🔧</span> Downloading - ${percent}%` });
    mainWindow.setProgressBar(percent / 100);
});
autoUpdater.on('update-downloaded', info => {
    mainWindow.webContents.send('toApp', { name: 'updater-update-downloaded', payload: '<span class="u-size:12">👌</span> Updates downloaded, installing now.' });
});

autoUpdater.on('update-downloaded', info => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 500 ms.
    // You could call autoUpdater.quitAndInstall() immediately

    setTimeout(function() {
        autoUpdater.quitAndInstall();
    }, 5000)
});

app.on('ready', function() {
    setTimeout(function() {
        startAutoUpdater();
        console.log('Started Auto Updater from timeout');
        if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'developement') {
            console.log('Updater: Dummy Update');
            autoUpdater.emit('checking-for-update');
            setTimeout(function() {
                autoUpdater.emit('update-not-available');
            }, 5000);
        }
    }, 5000);
});
