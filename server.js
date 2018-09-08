var http = require('http');

var server = http.createServer();

var Gun = require('gun');
var gun = Gun({ web: server });

// Start the server on port 8080.
server.listen(8080, function () {
    console.log('Server listening on http://localhost:8080/gun')
})

