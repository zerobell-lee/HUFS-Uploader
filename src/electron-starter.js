// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
const fs = require('fs');
FormData = require('form-data');
const fetch = require('node-fetch');
const async = require('async');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let contents

function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);
  contents = mainWindow.webContents

  contents.send('log', 'Hello Its main')
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

makeForm = path => {
    frm = new FormData();
    frm.append('siteId', 'hufsjp2')
    frm.append('handle', '113544142')
    frm.append('attachFile', '10')
    frm.append('command', 'bbsUp')
    frm.append('boardType', '')
    frm.append('imgid', '')
    frm.append('file1', fs.createReadStream(path))

    return frm
}

ipcMain.on('upload', (event, arg) => {
    console.log('Got Uploaded')
    doUpload(event, arg)
    // event.sender.send
})

doUpload = (event, arg) => {
    async.series(arg.map((i) => {
        return (callback) => {
            var form = makeForm(i)
            res = fetch('http://builder.hufs.ac.kr/common/upFileExecute1.action', {method: 'POST', body: form})
            .then((res)=>res.text())
            .then((showRes) => {
                var filename1 = showRes.split('filename1 = ')[1].split(';')[0]
                var filename2 = showRes.split('filename2 = ')[1].split(';')[0]
                var fileSize = showRes.split('fileSize = ')[1].split(';')[0]
                var fileCode = showRes.split('fileCode = ')[1].split(';')[0]
                callback(null, `jf_upFile(${filename1}, ${filename2}, ${fileSize}, ${fileCode});\n`)
            })
        }
    }),
    (err, result) => {
        if (err) event.sender.send('SetTextArea', "error!")
        var command = 'document.form_write.attechFile.value = "104857600";\ndocument.form_write.pdsSize.value = "104857600";\n'
        for (j = 0; j < result.length; j++) {
            command += result[j]
        }
        event.sender.send('SetTextArea', command)
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
