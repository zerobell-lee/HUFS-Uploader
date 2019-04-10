// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
const fs = require('fs');
FormData = require('form-data');
const fetch = require('node-fetch');
const async = require('async');
var setCookie = require('set-cookie-parser');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let contents

let jses, token, wmon
let current_id

function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, resizable: process.ELECTRON_START_URL?false:true})

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

makeUploadForm = path => {
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

trim = (str) => str.replace(/^\s*/,'').replace(/\s*$/, '')

doWrite = (event, title, files, name) => {

  event.sender.send('SetTextArea', 'writing...')
  frm = new FormData();
  frm.append('parent', '%2Fuser%2FindexSub.action%3FcodyMenuSeq%3D113536206%26siteId%3Dhufsjp2%26menuType%3DT%26uId%3D12%26sortChar%3DA%26linkUrl%3D6_4.html%26mainFrame%3Dright%26dum%3Ddum%26boardId%3D113544142%26page%3D1%26command%3DalbumWrite%26chkBoxSeq%3D%26categoryDepth%3D')
  frm.append('command', 'albumWrite')
  frm.append('boardRecord.userName', name)
  frm.append('hidFileName', '')
  frm.append('hidFileName2', '')
  frm.append('hidFileSize', '')
  frm.append('chkBoxSeq', '')
  frm.append('siteId', 'hufsjp2')
  frm.append('boardRecord.boardConfig.boardId', '113544142')
  frm.append('boardId', '113544142')
  frm.append('boardRecord.boardSeq', '0')
  frm.append('boardSeq', '0')
  frm.append('boardRecord.refSeq', '0')
  frm.append('boardRecord.famSeq', '0')
  frm.append('boardRecord.pos', '0')
  frm.append('boardRecord.depth', '0')
  frm.append('boardRecord.boardType', '02')
  frm.append('boardRecord.readCnt', '')
  frm.append('boardRecord.emailReceive', '')
  frm.append('boardRecord.basketYn', '')
  frm.append('boardRecord.commentCnt', '')
  frm.append('imsiDir', files[0].dir) //different 아마 이거 떄문인듯.
  frm.append('boardRecord.categoryId', '')
  frm.append('boardRecord.fileCnt', files.length) // FileCnt
  
  frm.append('pdsCnt', '10')
  frm.append('delFile', '')
  frm.append('pdsSize', '10485760')
  frm.append('attechFile', '10485760')
  frm.append('page', '1')
  frm.append('boardType', '02')
  frm.append('listType', '02')
  frm.append('boardRecord.userId', current_id)
  frm.append('aliasYn', 'N')
  frm.append('boardRecord.editorYn', 'Y')
  frm.append('boardRecord.frontYn', 'Y')
  frm.append('boardRecord.title', title)
  frm.append('userName', name)
  frm.append('boardRecord.publishFrom', '2019-01-29')
  frm.append('boardRecord.publishTo', '2020-01-29')
  frm.append('boardRecord.contents', 'Uploaded by HUFSuploader')
  frm.append('upfile', '')// upFile meaningLess
  
  frm.append('boardRecord.renameFile', '')

  frm.append('boardRecord.orgFile', files[0].text)
  frm.append('thumbnailFileSeq', files[0].value)

  var upLoadFileValue = ''
  var upLoadFileText = ''
  var size_list = ''
  var fileSize = 0

  event.sender.send('log', frm)
  for (var i=0; i<files.length; i++) {
    fi = files[i]
    upLoadFileValue += '/' + fi.value
    upLoadFileText += '/' + fi.text
    size_list += '/' + fi.text + '***' + fi.size
    fileSize += fi.size
  }

  frm.append('upLoadFileValue', upLoadFileValue)
  event.sender.send('log', frm)
  frm.append('upLoadFileText', upLoadFileText)
  frm.append('size_list', size_list)
  frm.append('fileSize', '' + fileSize) //different
  event.sender.send('log', frm)

  var ck = 'sso_token=' + token + '; JSESSIONID_WWW=' + jses + '; ' + 'WMONID=' + wmon
  fetch('http://builder.hufs.ac.kr/user/albumWriteExecute.action', {method: 'POST', headers: {'Cookie': ck}, body: frm})
  .then(res=>event.sender.send('SetTextArea', res.body()))
  

}

makeLoginForm = (id, pwd) => {
  frm = new FormData()
  frm.append('userId', id)
  frm.append('userPw', pwd)
  frm.append('parent', '%2Fuser%2FindexSub.action%3FcodyMenuSeq%3D110137663%26siteId%3Dhufsjp1%26menuType%3DT%26uId%3D11%26sortChar%3DA%26menuFrame%3Dleft%26linkUrl%3Dlogin.html%26mainFrame%3Dright')
  frm.append('siteId', 'hufsjp1')
  frm.append('loginskin_num', 0)
  frm.append('encodingYN', 'Y')

  return frm
}

ipcMain.on('upload', (event, arg) => {
    console.log('Got Uploaded')
    doUpload(event, arg)
    // event.sender.send
})

ipcMain.on('login', (event, arg) => {
  doLogin(event, arg)
})

doLogin = (event, arg) => {
  var form = makeLoginForm(arg.id, arg.pwd)
  fetch('https://builder.hufs.ac.kr/user/login.action', {method: 'POST', body: form})
  .then(res => res.headers.get('set-cookie'))
  .then(cookie => {
    cookies = setCookie.parse(setCookie.splitCookiesString(cookie), { map: true})
    if (cookies.sso_token) {
      token= cookies.sso_token.value
      jses= cookies.JSESSIONID_WWW.value
      wmon= cookies.WMONID.value

      /*token = 'Vy23zFySFx5FASzTyGIDx5FDEMO1zCy1550059784zPy86400zAy33zEyjdl9x2Fqs03rrKiTlLx79x78x780jvutcq6KqoVrE9TtwcZiAlA79Ye24ET3PDe4l2cJs8x7AQuie36fvENFQSQWx78aNHIFvokMmco9TQ3WgD2ZBN5tARBK8Kotw6k3GnR9f6STJVCMKvRHPAx789EcEsXnV1QReC0msAIIatgM872x2FuLMjGIwncP7S0Yx7Aox79HOGlx2FasDCUW8hwYx2FX54pox79LdQx78gTo1aphGUx2FhSOsax2Fx2BQ7x78iGK2px792ldOLLx78bUX5LnVh2huWmSF8YJhU3llx2Fwad2LMS26vRg065cER1Yx2Bx79hosXgKAkCtctx79KZ4qudUcx2FrCLcLI3LAhjrpvCx7AKj0GABPGpoc0oFBZRhVN0x2FFYvpx2Fjx2F1bKjtZnx79QowvXlG2ISbmrfQdObd9ijdRCYchdvICe4kJ02lLx2BEkx2BCUQx3Dx3DzKywC49Rhcgx2BXN22Gx78rEXisex79L0Hx79x2FR1x79DBuaEagYBM2eEx3DzMyvOKwK0cQeu4x3Dz'
      jses = 'JuXzNEvO0SHq1DB4utEn2QZNKJs9T5xOxckFrWu5drvekuioUjBHpDptBM4vdqt7.www_servlet_builder'
      wmon = 'gETJTSH2eWQ'*/
      current_id = arg.id

      event.sender.send('login result', {success: true})
    }
    else {
      event.sender.send('login result', {success: false})
      /* var wmon
      var jses
      var token

      var lines = cookie.split(';') */
      //for (var i = 0; i < lines.length; i++) {
        //Parsing Cookie
        //Send Tokens to Renderer
      //}
    }
  })
}

doUpload = (event, arg) => {
    var paths = arg.pathArr
    event.sender.send('SetTextArea', 'uploading...')
    async.series(paths.map((i) => {
        return (callback) => {
            var form = makeUploadForm(i)
            res = fetch('http://builder.hufs.ac.kr/common/upFileExecute1.action', {method: 'POST', body: form})
            .then((res)=>res.text())
            .then((showRes) => {
              event.sender.send('SetTextArea', 'uploading...' + i)
                var filename1 = showRes.split('filename1 = ')[1].split(';')[0].split("'")[1]
                var filename2 = showRes.split('filename2 = ')[1].split(';')[0].split("'")[1]
                var fileSize = showRes.split('fileSize = ')[1].split(';')[0].split("'")[1]
                var fileCode = showRes.split('fileCode = ')[1].split(';')[0].split("'")[1]
                callback(null, {dir: filename1.split('/')[0], text: trim(filename1.split('/')[1]), value: fileCode, size: fileSize})
            })
        }
    }),
    (err, result) => {
        if (err) event.sender.send('SetTextArea', "error!")
        var files = []
        for (j = 0; j < result.length; j++) {
            files[j] = result[j]
        }
        event.sender.send('SetTextArea', 'sending...')
        doWrite(event, arg.title, files, arg.name)
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
