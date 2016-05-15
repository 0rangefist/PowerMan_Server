//v3
//done schedule services for led1,led2,led3,led4
//=========================================
//--SETUP THE WEBSERVER--
//=========================================
express = require('express');  //web server
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);	//web socket server
server.listen(8080); //start the webserver on port 8080
app.use(express.static('public')); //tell the server that ./public/ contains the static webpages

//Import cron-schedule
var cron1 = require('node-schedule');
var cron2 = require('node-schedule');
var cron3 = require('node-schedule');
var cron4 = require('node-schedule');

//=========================================
//--OPEN THE SERIAL PORT--
//=========================================
//var SerialPort = require("serialport").SerialPort
//var serialPort = new SerialPort("/dev/rfcomm0", { baudrate: 9600 });
// /dev/ttyACM0 - use this port for USB serial communication
// /dev/rfcomm0 - use this for bluetooth serial communication

//=========================================
//--DEFINE WEBSOCKET BEHAVIOUR--
//=========================================

var state1 = 0; //startup states (junk)
var state2 = 1;
var state3 = 2;
var state4 = 3;

io.sockets.on('connection', function (socket) { //gets called whenever a client connects
	console.log('Started Client!');
	
	socket.emit('led1', {value: state1}); //send the new client the current state
	socket.emit('led2', {value: state2}); //send the new client the current state
	socket.emit('led3', {value: state3}); //send the new client the current state
	socket.emit('led4', {value: state4}); //send the new client the current state
	
	socket.on('led1s', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		var onSchedule1 = cron1.scheduleJob(data.onDate, function(){
			state1=data.onValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led1', {value: state1});
			socket.emit('led1s', {value: state1});
			console.log('On schedule fired!');
		});
		
		var offSchedule1 = cron1.scheduleJob(data.offDate, function(){
			state1=data.offValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led1', {value: state1});
			socket.emit('led1s', {value: state1});
			console.log('Off schedule fired!');
		});
    });
	
	socket.on('led2s', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		var onSchedule2 = cron2.scheduleJob(data.onDate, function(){
			state2=data.onValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led2', {value: state2});
			socket.emit('led2s', {value: state2});
			console.log('On schedule fired!');
		});
		
		var offSchedule2 = cron2.scheduleJob(data.offDate, function(){
			state2=data.offValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led2', {value: state2});
			socket.emit('led2s', {value: state2});
			console.log('Off schedule fired!');
		});
    });
	
	socket.on('led3s', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		var onSchedule3 = cron3.scheduleJob(data.onDate, function(){
			state3=data.onValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state3, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led3', {value: state3});
			socket.emit('led3s', {value: state3});
			console.log('On schedule fired!');
		});
		
		var offSchedule3 = cron3.scheduleJob(data.offDate, function(){
			state3=data.offValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state3, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led3', {value: state3});
			socket.emit('led3s', {value: state3});
			console.log('Off schedule fired!');
		});
    });
	
	socket.on('led4s', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		var onSchedule4 = cron4.scheduleJob(data.onDate, function(){
			state4=data.onValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state4, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led4', {value: state4});
			socket.emit('led4s', {value: state4});
			console.log('On schedule fired!');
		});
		
		var offSchedule4 = cron4.scheduleJob(data.offDate, function(){
			state4=data.offValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state4, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led4', {value: state4});
			socket.emit('led4s', {value: state4});
			console.log('Off schedule fired!');
		});
    });
    
    socket.on('led1', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state1 = data.value; //update the state of led1
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led1', {value: state1}); //sends the updated state to all connected clients
    });
	
    socket.on('led2', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state2 = data.value; //update the state of led2
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state2, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led2', {value: state2}); //sends the updated state to all connected clients
    });
	
	
    socket.on('led3', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state3 = data.value; //update the state of led3
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state3, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led3', {value: state3}); //sends the updated state to all connected clients
    });
	
	
    socket.on('led4', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state4 = data.value; //update the state of led4
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state4, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led4', {value: state4}); //sends the updated state to all connected clients
    });
	
	
});