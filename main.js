// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
var express = require('express')
var server = express()
var NodeWebcam = require( "node-webcam" );
var request = require("request");
var imgur = require('imgur');
// const io = require('socket.io')();
// io.on('connection', client => {
//   client.on('event', data => { /* … */ });
//   client.on('disconnect', () => { /* … */ });
// });
// io.listen(1338);

var weather = require('weather-js');

//you can use error handling to see if there are any errors
app.commandLine.appendSwitch("disable-gpu")
app.commandLine.appendArgument("disable-gpu")
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming '+events.length+' events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
        console.log(event);
        var ev = JSON.stringify(event)
        console.log(ev);
        var d = new Date(event.start.dateTime)
        // d.getFullYear() // year
        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        var day_week = days[d.getDay()]
        var day_month = d.getUTCDate()
        var month = ""
        for (var i = 0; i < 3; i++) {
          var z = months[d.getMonth()]
          month += z[i]
        }
        month += '.'
        var time_obj = getTimeMe(d)
        var time = time_obj.hour + ":" + time_obj.minutes
        var text = day_week + " " + day_month + " " + month + " " + time
        var event_name = event.summary
        mainWindow.webContents.executeJavaScript("$('#event_time').text('"+text+"'); $('#event_name').text('"+event_name+"')")
        // d.getUTCDate() // day month
        // d.getMonth() // month + 1
        // d.getHours() // hours
        // d.getMinutes() // minutes
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}
function format(i) {

    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getTimeMe(date) {

    var today = new Date(date),
        h = today.getHours();
        m = today.getMinutes();
        s = today.getSeconds();

    h = format(h);
    m = format(m);
    s = format(s);

    return {
        hour : h,
        minutes : m,
        seconds : s
    };
}
app.on('ready', () => {
  createWindow()
})
function createWindow (events, weath) {
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
  weather.find({search: 'Tomsk', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
    // var weath = JSON.stringify(result)
    console.log(weath);
    mainWindow.webContents.executeJavaScript("$('#temperature').text('"+result[0].current.temperature+"°c'); $('#humidity').text('Влажность "+result[0].current.humidity+"'); $('#wind').text('Ветер  "+result[0].current.windspeed+"'); console.log('"+result[0].current.temperature+"');");
  });
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });
  // Open the DevTools.
  mainWindow.webContents.executeJavaScript("console.log('"+events+"');");
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
    // createCapture()
    // checkSize = true
    mainWindow.webContents.executeJavaScript("document.getElementById('ads').style.display = 'block'");
  }else{
    mainWindow.webContents.executeJavaScript("document.getElementById('ads').style.display = 'none'; document.getElementById('doner').style.display = 'none'; document.getElementById('harats').style.display = 'none'");
    // checkSize = false
  }
  res.send('good')
})
var opts = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location",
    verbose: false

};
var Webcam = NodeWebcam.create( opts );
var stats = []
function createCapture(){
  NodeWebcam.capture( "my_picture", {}, function( err, data ) {
      if ( !err ){
          console.log( "Image created!" )
          // Setting
          imgur.setClientId('018ebfa932f27b1');
              // A single image
          imgur.uploadFile('my_picture.jpg')
              .then(function (json) {
                  // Replace <Subscription Key> with your valid subscription key.
                  const subscriptionKey = '4e4286d7b1cd4989868725a00664c633';

                  // You must use the same location in your REST call as you used to get your
                  // subscription keys. For example, if you got your subscription keys from
                  // westus, replace "westcentralus" in the URL below with "westus".
                  // центральная южная часть сша
                  const uriBase = 'https://southcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

                  const imageUrl = json.data.link;

                  // Request parameters.
                  const params = {
                      'returnFaceId': 'true',
                      'returnFaceLandmarks': 'false',
                      'returnFaceAttributes': 'emotion'
                  };

                  var options = {
                      uri: uriBase,
                      qs: params,
                      body: '{"url": ' + '"' + imageUrl + '"}',
                      headers: {
                          'Content-Type': 'application/json',
                          'Ocp-Apim-Subscription-Key' : subscriptionKey
                      }
                  };

                  request.post(options, (error, response, body) => {
                    if (error) {
                      console.log('Error: ', error);
                      return;
                    }
                    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                    console.log('JSON Response\n');
                    console.log(jsonResponse);
                    jsonResponse = JSON.parse(jsonResponse)
                    var happiness = jsonResponse[0].faceAttributes.emotion.happiness,
                        sadness = jsonResponse[0].faceAttributes.emotion.sadness;
                    if(happiness > sadness){
                      console.log('ti s4astliva suka', happiness);
                      mainWindow.webContents.executeJavaScript("doner()")
                    }else{
                      console.log('ti grustniy suka', sadness);
                      mainWindow.webContents.executeJavaScript("harats()")
                    }
                  });
              })
              .catch(function (err) {
                  console.error(err.message);
              });

          // setInterval(createCapture, 15000)
      } else {
          console.log(err);
      }
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

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
