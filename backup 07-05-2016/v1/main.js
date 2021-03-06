//v1
//write states to of switches to file
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
//var cron5 = require('node-schedule');

//Import file system for reading and writing to files
fs = require('fs');

//Import mkdirp for creating directories
//var mkdirp = require('mkdirp');

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

var state1; //startup states
var state2;
var state3;
var state4;
//var currentDir = 'overflow/'; //variable that holds the current directory we save data to
//var monthlyTotal1=0;
//var monthlyTotal2=0;
//var monthlyTotal3=0;
//var monthlyTotal4=0;

//temporal function to generate random data
function randomNumber (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


//create 'overflow' directory to compensate for switch over time
mkdirp(currentDir, function(error) {
	if(error) {
		console.log(error);
	}
}); 

//check the year and month we're in everyday at midnight
var checkDate = cron5.scheduleJob('18 13 * * *', function(){
	var date = new Date();
	var month = date.getMonth();
	console.log(date);
	
	//set the current dir to the current date and month we're in
	currentDir = year + '/' + month + '/';
	
	//create the current directory
	mkdirp(currentDir, function(error) {
		if(error) {
			console.log(error);
		}
	}); 
	
});

//var schedule = require('node-schedule');
//	var j = schedule.scheduleJob('*/5 * * * * *', function(){
//  console.log('The answer to life, the universe, and everything!');
//});

var date = new Date();
var da =  date.getDate+1;
console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - '+ date.getDate()+ ' ' + (date.getMonth()+1) + ' ' + date.getFullYear());

io.sockets.on('connection', function (socket) { //gets called whenever a client connects
	console.log('Started Client!');
	
	var state1 = fs.readFileSync('state1.txt','utf8');
	var state2 = fs.readFileSync('state2.txt','utf8');
	var state3 = fs.readFileSync('state3.txt','utf8');
	var state4 = fs.readFileSync('state4.txt','utf8');
	
	socket.emit('led1', {value: state1}); //send the new client the current state
	socket.emit('led2', {value: state2}); //send the new client the current state
	socket.emit('led3', {value: state3}); //send the new client the current state
	socket.emit('led4', {value: state4}); //send the new client the current state
	
	setInterval(function () { 
		//console.log('second passed');
		var num1 = randomNumber(300,600);
		var num2 = randomNumber(100,300);
		var num3 = randomNumber(1000,4000);
		var num4 = randomNumber(4000,7000);
//		monthlyTotal1 = monthlyTotal1 + num1;
//		monthlyTotal2 = monthlyTotal2 + num2;
//		monthlyTotal3 = monthlyTotal3 + num3;
//		monthlyTotal4 = monthlyTotal4 + num4;
//		fs.writeFile(currentDir+'switch1.txt', monthlyTotal1, function (err) {
//  			if (err) return console.log(err);
//		});
//		fs.writeFile(currentDir+'switch2.txt', monthlyTotal2, function (err) {
//  			if (err) return console.log(err);
//		});
//		fs.writeFile(currentDir+'switch3.txt', monthlyTotal3, function (err) {
//  			if (err) return console.log(err);
//		});
//		fs.writeFile(currentDir+'switch4.txt', monthlyTotal4, function (err) {
//  			if (err) return console.log(err);
//		});
		io.sockets.emit('stream', {value1:num1, value2:num2, value3:num3, value4:num4}); //sends the updated state to all connected clients
	}, 1000); 

	
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
		
		fs.writeFile('state1.txt', state1, function (err) {
  		if (err) return console.log(err);
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
		fs.writeFile('state2.txt', state2, function (err) {
  		if (err) return console.log(err);
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
		fs.writeFile('state3.txt', state3, function (err) {
  		if (err) return console.log(err);
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
		fs.writeFile('state4.txt', state4, function (err) {
  		if (err) return console.log(err);
		});
    });
    
    socket.on('led1', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state1 = data.value; //update the state of led1
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led1', {value: state1}); //sends the updated state to all connected clients
		fs.writeFile('state1.txt', state1, function (err) {
  		if (err) return console.log(err);
		});
    });
	
    socket.on('led2', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state2 = data.value; //update the state of led2
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state2, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led2', {value: state2}); //sends the updated state to all connected clients
		fs.writeFile('state2.txt', state2, function (err) {
  		if (err) return console.log(err);
		});
    });
	
	
    socket.on('led3', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state3 = data.value; //update the state of led3
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state3, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led3', {value: state3}); //sends the updated state to all connected clients
		fs.writeFile('state3.txt', state3, function (err) {
  		if (err) return console.log(err);
		});
    });
	
	
    socket.on('led4', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		state4 = data.value; //update the state of led4
//        var buf = new Buffer(1); //creates a new 1-byte buffer
//        buf.writeUInt8(state4, 0); //writes the pwm value to the buffer
//        serialPort.write(buf); //transmits the buffer to the arduino
        io.sockets.emit('led4', {value: state4}); //sends the updated state to all connected clients
		fs.writeFile('state4.txt', state4, function (err) {
  		if (err) return console.log(err);
		});
    });
	
	
});