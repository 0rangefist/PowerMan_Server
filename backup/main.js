//=========================================
//--SETUP THE WEBSERVER--
//=========================================
express = require('express');  //web server
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);	//web socket server

server.listen(8080); //start the webserver on port 8080
app.use(express.static('public')); //tell the server that ./public/ contains the static webpages

//=========================================
//--OPEN THE SERIAL PORT--
//=========================================
var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/rfcomm0", { baudrate: 9600 });
// /dev/ttyACM0 - use this port for USB serial communication
// /dev/rfcomm0 - use this for bluetooth serial communication
//====================================rf=====
//--DEFINE WEBSOCKET BEHAVIOUR--
//=========================================
var brightness = 0; //static variable to hold the current brightness
io.sockets.on('connection', function (socket) { //gets called whenever a client connects
	console.log('Started Client!');
    socket.emit('led', {value: brightness}); //send the new client the current brightness

    socket.on('led', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
        brightness = data.value;  //updates brightness from the data object
        var buf = new Buffer(1); //creates a new 1-byte buffer
        buf.writeUInt8(brightness, 0); //writes the pwm value to the buffer
        serialPort.write(buf); //transmits the buffer to the arduino

        io.sockets.emit('led', {value: brightness}); //sends the updated brightness to all connected clients
    });
});
