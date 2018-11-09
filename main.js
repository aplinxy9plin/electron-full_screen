// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
var express = require('express')
var server = express()
app.commandLine.appendSwitch("disable-gpu")
app.commandLine.appendArgument("disable-gpu")
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
       height: 600,
       width: 800,
       minHeight: 610,
       minWidth: 561
     });
  // for the full screen!!!
  mainWindow.setFullScreen(true)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
server.get('/distance', (req, res) => {
  var check = req.query.distance;
  if(check == "hide"){
    // checkSize = true
    mainWindow.webContents.executeJavaScript("checkSize = true; document.getElementsByClassName('video')[0].click()");
  }else{
    mainWindow.webContents.executeJavaScript("checkSize = false; document.getElementsByClassName('video')[0].click()");
    // checkSize = false
  }
  res.send('good')
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
server.listen(1338, () => {
  console.log('Server listening on port 1338');
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
