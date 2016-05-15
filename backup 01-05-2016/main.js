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
    socket.on('led1', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state1 = data.value; //update the state of led1
        var buf = new Buffer(1); //creates a new 1-byte buffer
        buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led1', {value: state1}); //sends the updated state to all connected clients
		socket.emit('echo led1', data);
    });
	
	socket.emit('led2', {value: state2}); //send the new client the current state
    socket.on('led2', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state2 = data.value; //update the state of led2
        //var buf = new Buffer(1); //creates a new 1-byte buffer
        //buf.writeUInt8(state2, 0); //writes the pwm value to the buffer
        //serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led2', {value: state2}); //sends the updated state to all connected clients
		socket.emit('echo led2', data);
    });
	
	
	socket.emit('led3', {value: state3}); //send the new client the current state
    socket.on('led3', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state3 = data.value; //update the state of led3
        var buf = new Buffer(1); //creates a new 1-byte buffer
        buf.writeUInt8(state3, 0); //writes the pwm value to the buffer
        //serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led3', {value: state3}); //sends the updated state to all connected clients
		socket.emit('echo led3', data);
    });
	
	
	socket.emit('led4', {value: state4}); //send the new client the current state
    socket.on('led4', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state4 = data.value; //update the state of led4
        //var buf = new Buffer(1); //creates a new 1-byte buffer
        //buf.writeUInt8(state4, 0); //writes the pwm value to the buffer
        //serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led4', {value: state4}); //sends the updated state to all connected clients
		socket.emit('echo led4', data);
    });
	
	
	//for scheduled switching ===================================	
	var CronJob = require('cron').CronJob;
	socket.emit('led1', {value: state1}); //send the new client the current state
    	socket.on('led1s', function (schedule) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + schedule);
		//setup on job
		
		var onJob = new CronJob({
		  cronTime: schedule.onSchedule,
		  onTick: function() {
			/*
			 * Runs every weekday (Monday through Friday)
			 * at 11:30:00 AM. It does not run on Saturday
			 * or Sunday.
			 */
			state1 = shedule.onValue; //update the state of led1
			//var buf = new Buffer(1); //creates a new 1-byte buffer
			//buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
			//serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led1s', {value: state1}); //sends the updated state to all connected clients
			}
		});
		onJob.start();
		
		
	
});