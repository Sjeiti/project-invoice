/*globals process, __dirname*/
/*jshint -W097 */
'use strict';

var app = require('app')
  ,BrowserWindow = require('browser-window')
  ,connect = require('connect')
  ,serveStatic = require('serve-static')
  ,port = 8181
  ,debug = true
  ,mainWindow = null // Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.
;

require('crash-reporter').start(); // Report crashes to our server.

app.on('window-all-closed',handleAppWindowAllClosed);
app.on('ready', handleAppReady);

connect().use(serveStatic(__dirname)).listen(port);

/**
 * This method will be called when Electron has finished initialization and is ready to create browser windows.
 */
function handleAppReady(){
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('http://localhost:'+port+'/');
  debug&&mainWindow.webContents.openDevTools();
  mainWindow.on('closed', handleMainWindowClosed);
}

/**
 * Quit when all windows are closed.
 * On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
 */
function handleAppWindowAllClosed() {
  process.platform!='darwin'&&app.quit();
}

/**
 * Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element.
 */
function handleMainWindowClosed(){
    mainWindow = null;
}