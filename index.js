var app = require('express')(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  cache = [];

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});

app
  .get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  })
  .get('/cache', function(req, res) {
    var reservedAry = cache.slice(0).reverse();
    res.json({
      meta: {},
      data: {
        messages: reservedAry
      }
    });
  })
  .get('/cache/clean', function(req, res) {
    cache = [];
    res.json({
      meta: {},
      data: {
        messages: cache
      }
    });
  });

io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    if (cache.length > 29) {
      cache = cache.slice(cache.length - 29);
    }
    cache.push(msg);
    io.emit('chat message', msg);
  });
});

http.listen(4321, function() {
  console.log('listening on *:4321');
});