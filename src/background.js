// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;

var setApplicationDevMenu = function() {
    var menus = [devMenuTemplate];
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Set Electron's userData and Temp paths to project root to make it portable
var userDataPath = path.join(__dirname, env.userData);
app.setPath('userData', userDataPath);
app.setPath('temp', path.join(userDataPath, 'Temp'));

app.on('ready', function() {

    // Only set app menu when not in production
    if (env.name !== 'production') {
        setApplicationDevMenu();
    }

    var mainWindow = createWindow('main', {
        width: 960,
        height: 650,
        resizable: false,
        icon: path.join(__dirname, '../assets/icons/png/64x64.png')
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    if (env.name === 'development') {
        var PATH_APP_NODE_MODULES = path.join(__dirname, 'node_modules');
        require('module').globalPaths.push(PATH_APP_NODE_MODULES);
        // mainWindow.openDevTools();
    }
});

app.on('window-all-closed', function() {
    app.quit();
});