var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1338);

function handler (req, res) {
  fs.readFile(__dirname + '/index1.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
var x;
io.on('connection', function (socket) {
  console.log(socket);
  socket.emit('news', { hello: x });
  socket.emit('qwe', { hello: x });
  socket.on('my other event', function (data) {
    console.log(data);
    x = data
    var type = data.type;
    socket.send('fuck')
    // socket.emit('qwe', { hello: x });
  });
});
