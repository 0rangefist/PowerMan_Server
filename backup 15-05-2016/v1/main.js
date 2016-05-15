//v1
//-kWh computation persisting
//-schedules persisting
//-switch states persisting
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
var cron5 = require('node-schedule');

//Import file system for reading and writing to files
fs = require('fs');

//Import mkdirp for creating directories
var mkdirp = require('mkdirp');

//Impoort file-exists to check if a file exists
var fileExists = require('file-exists');

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

//switch state variables(store integers representing ON or OFF)
var state1; 
var state2;
var state3;
var state4;
//variables that store monthly totals for each switch 
//set to zero unless a monthlyTotalFile of a switch for that month is found later in code
var monthlyTotal1 = 0;
var monthlyTotal2 = 0;
var monthlyTotal3 = 0;
var monthlyTotal4 = 0;
//variables that store the monthly total file names for each switch
var monthlyTotal1File = 'monthlyTotal1.txt'; 
var monthlyTotal2File = 'monthlyTotal2.txt';
var monthlyTotal3File = 'monthlyTotal3.txt';
var monthlyTotal4File = 'monthlyTotal4.txt';
//parent directory for statistics & historic data collected over time
var statsFolder = 'stats/'; 
var schedulesFolder = 'schedules/';

//when the server boots, set the current directory immediately to the current year and month
//this will allow continued accumulation of monthly data even when there are power cuts.
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
console.log('The date is ' + date);
	
//set the current dir to the current date and month we're in
currentDir = statsFolder + year + '/' + month + '/';

//create the current year-month directory(if it doesn't exist already)
mkdirp(currentDir, function(error) {
	if(error) {
		console.log(error);
	}
}); 

//check the year and month we're in everyday at midnight
//we do this so we can stop recording data for a previous month
//and start recording the data for a new month
var checkDate = cron5.scheduleJob('24 9 * * *', function(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	console.log('The date is ' + date);
	
	//set the current dir to the current date and month we're in
	currentDir = statsFolder + year + '/' + month + '/';
	
	//create the current directory which is based on the year and month we're in
	mkdirp(currentDir, function(error) {
		if(error) {
			console.log(error);
		}
	}); 
});


//temporal function to generate random data
function randomNumber (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

//create schedule directory to persist schedules to file in case of a power cut
mkdirp(schedulesFolder, function(error) {
	if(error) {
		console.log(error);
	}
}); 

// create schedule persistance variables
var onSchedule1File = 'onSchedule1.txt';
var onSchedule2File = 'onSchedule2.txt';
var onSchedule3File = 'onSchedule3.txt';
var onSchedule4File = 'onSchedule4.txt';

var offSchedule1File = 'offSchedule1.txt';
var offSchedule2File = 'offSchedule2.txt';
var offSchedule3File = 'offSchedule3.txt';
var offSchedule4File = 'offSchedule4.txt';

//debug code to tell me the current date and time
var date = new Date();
var da =  date.getDate+1;
console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - '+ date.getDate()+ ' ' + (date.getMonth()+1) + ' ' + date.getFullYear());

//switch state values
var switch1On = 4;
var switch2On = 5;
var switch3On = 6;
var switch4On = 7;

var switch1Off = 0;
var switch2Off = 1;
var switch3Off = 2;
var switch4Off = 3;


//Start the sockets connection to allow communication with clients(our android app)
io.sockets.on('connection', function (socket) { //gets called whenever a client connects
	console.log('Started Client!');
	
	//=============================================================================
	// RECOVER SWITCH STATES from file after power or server interruption
	//=============================================================================
	var state1 = fs.readFileSync('state1.txt','utf8');
	var state2 = fs.readFileSync('state2.txt','utf8');
	var state3 = fs.readFileSync('state3.txt','utf8');
	var state4 = fs.readFileSync('state4.txt','utf8');
	
	socket.emit('led1', {value: state1}); //send the new client the current state
	socket.emit('led2', {value: state2}); //send the new client the current state
	socket.emit('led3', {value: state3}); //send the new client the current state
	socket.emit('led4', {value: state4}); //send the new client the current state
	
	//=============================================================================
	// RECOVER SCHEDULES from file if they exist after power or server interruption
	//=============================================================================
	if(fileExists(schedulesFolder + onSchedule1File)) {
		var onDate = fs.readFileSync(schedulesFolder + onSchedule1File,'utf8');
		var offDate = fs.readFileSync(schedulesFolder + offSchedule1File,'utf8');
		var onSchedule1 = cron1.scheduleJob(onDate, function(){
			state1=switch1On;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state1.txt', state1, function (err) {
				if (err) return console.log(err);
			});
			io.sockets.emit('led1', {value: state1});
			socket.emit('led1s', {value: state1});
			console.log('On schedule fired!');
		});
		
		var offSchedule1 = cron1.scheduleJob(offDate, function(){
			state1=switch1Off;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state1, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state1.txt', state1, function (err) {
				if (err) return console.log(err);
			});
			io.sockets.emit('led1', {value: state1});
			socket.emit('led1s', {value: state1});
			console.log('Off schedule fired!');
		});
	}
	
	if(fileExists(schedulesFolder + onSchedule2File)) {
		var onDate = fs.readFileSync(schedulesFolder + onSchedule2File,'utf8');
		var offDate = fs.readFileSync(schedulesFolder + offSchedule2File,'utf8');
		var onSchedule2 = cron2.scheduleJob(onDate, function(){
			state2=switch2On;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state2, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state2.txt', state2, function (err) {
  				if (err) return console.log(err);
			});
			io.sockets.emit('led2', {value: state2});
			socket.emit('led2s', {value: state2});
			console.log('On schedule fired!');
		});
		
		var offSchedule2 = cron2.scheduleJob(offDate, function(){
			state2=switch2Off;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state2, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state2.txt', state2, function (err) {
  				if (err) return console.log(err);
			});
			io.sockets.emit('led2', {value: state2});
			socket.emit('led2s', {value: state2});
			console.log('Off schedule fired!');
		});
    }
	
	if(fileExists(schedulesFolder + onSchedule3File)) { 
		var onDate = fs.readFileSync(schedulesFolder + onSchedule3File,'utf8');
		var offDate = fs.readFileSync(schedulesFolder + offSchedule3File,'utf8');
		var onSchedule3 = cron3.scheduleJob(onDate, function(){
			state3=switch3On;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state3, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state3.txt', state3, function (err) {
  				if (err) return console.log(err);
			});
			io.sockets.emit('led3', {value: state3});
			socket.emit('led3s', {value: state3});
			console.log('On schedule fired!');
		});
		
		var offSchedule3 = cron3.scheduleJob(offDate, function(){
			state3=switch3Off;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state3, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state3.txt', state3, function (err) {
  				if (err) return console.log(err);
			});
			io.sockets.emit('led3', {value: state3});
			socket.emit('led3s', {value: state3});
			console.log('Off schedule fired!');
		});
	}
	
	if(fileExists(schedulesFolder + onSchedule4File)) { 
		var onDate = fs.readFileSync(schedulesFolder + onSchedule4File,'utf8');
		var offDate = fs.readFileSync(schedulesFolder + offSchedule4File,'utf8');
		var onSchedule4 = cron4.scheduleJob(onDate, function(){
			state4=switch4On;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state4, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state4.txt', state4, function (err) {
				if (err) return console.log(err);
			});
			io.sockets.emit('led4', {value: state4});
			socket.emit('led4s', {value: state4});
			console.log('On schedule fired!');
		});
		
		var offSchedule4 = cron4.scheduleJob(offDate, function(){
			state4=switch4Off;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state4, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			fs.writeFile('state4.txt', state4, function (err) {
				if (err) return console.log(err);
			});
			io.sockets.emit('led4', {value: state4});
			socket.emit('led4s', {value: state4});
			console.log('Off schedule fired!');
		});
	}
	
	//=============================================================================
	// STREAMING SOCKETS
	// sample the data coming from arduino every second and compute kWh
	// the kWh units are accumulated and stored in files and emitted to the client
	//=============================================================================
	
	//The monthlyTotal variables hold the current kWh consumption for the particular month we're in
	//When the server starts-up the very first time, they are all 0 ... (this initialization was done above)
	//Thereafter, the monthTotals are read from a previously saved file when the server boots again
	//This is to enable persistance of data in case of power cuts or server failures
	if(fileExists(currentDir + monthlyTotal1File)) {
		monthlyTotal1 = fs.readFileSync(currentDir + monthlyTotal1File,'utf8');
	}
	if(fileExists(currentDir + monthlyTotal2File)) {
		monthlyTotal2 = fs.readFileSync(currentDir + monthlyTotal2File,'utf8');
	}
	if(fileExists(currentDir + monthlyTotal3File)) {
		monthlyTotal3 = fs.readFileSync(currentDir + monthlyTotal3File,'utf8');
	}
	if(fileExists(currentDir + monthlyTotal4File)) {
		monthlyTotal4 = fs.readFileSync(currentDir + monthlyTotal4File,'utf8');
	}
	
	setInterval(function () { 
		//console.log('second passed');
		var sensorStream1 = randomNumber(300,600);
		var sensorStream2 = randomNumber(100,300);
		var sensorStream3 = randomNumber(1000,4000);
		var sensorStream4 = randomNumber(4000,7000);
		monthlyTotal1 = (Number(monthlyTotal1) + Number(sensorStream1/(1000*3600))) + ''; //each sample is converted to kWh
		monthlyTotal2 = (Number(monthlyTotal2) + Number(sensorStream2/(1000*3600))) + '';
		monthlyTotal3 = (Number(monthlyTotal3) + Number(sensorStream3/(1000*3600))) + '';
		monthlyTotal4 = (Number(monthlyTotal4) + Number(sensorStream4/(1000*3600))) + '';
		fs.writeFile(currentDir + monthlyTotal1File, monthlyTotal1, function (err) {
  			if (err) return console.log(err);
		});
		fs.writeFile(currentDir + monthlyTotal2File, monthlyTotal2, function (err) {
  			if (err) return console.log(err);
		});
		fs.writeFile(currentDir + monthlyTotal3File, monthlyTotal3, function (err) {
  			if (err) return console.log(err);
		});
		fs.writeFile(currentDir + monthlyTotal4File, monthlyTotal4, function (err) {
  			if (err) return console.log(err);
		});
		io.sockets.emit('stream', {value1:sensorStream1, value2:sensorStream2, value3:sensorStream3, value4:sensorStream4}); //sends the updated 		 state to all connected clients
	}, 1000); //send the data in intervals of 1 sec

	//=============================================================================
	// SCHEDULING SOCKETS
	// listening sockets that handle scheduling data coming from the client
	//=============================================================================
	socket.on('led1s', function (data) { //makes the socket react to 'led' packets by calling this function
		console.log('message received ' + data);
		
		//write schedules to file
		fs.writeFile(schedulesFolder + onSchedule1File, data.onDate, function (err) { 
  			if (err) return console.log(err);
		});
		fs.writeFile(schedulesFolder + offSchedule1File, data.offDate, function (err) {
  			if (err) return console.log(err);
		});
		
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
		
		//write schedules to file
		fs.writeFile(schedulesFolder + onSchedule2File, data.onDate, function (err) { 
  			if (err) return console.log(err);
		});
		fs.writeFile(schedulesFolder + offSchedule2File, data.offDate, function (err) {
  			if (err) return console.log(err);
		});
		
		var onSchedule2 = cron2.scheduleJob(data.onDate, function(){
			state2=data.onValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state2, 0); //writes the pwm value to the buffer
//            serialPort.write(buf); //transmits the buffer to the arduino
			io.sockets.emit('led2', {value: state2});
			socket.emit('led2s', {value: state2});
			console.log('On schedule fired!');
		});
		
		var offSchedule2 = cron2.scheduleJob(data.offDate, function(){
			state2=data.offValue;
//            var buf = new Buffer(1); //creates a new 1-byte buffer
//            buf.writeUInt8(state2, 0); //writes the pwm value to the buffer
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
		
		//write schedules to file
		fs.writeFile(schedulesFolder + onSchedule3File, data.onDate, function (err) { 
  			if (err) return console.log(err);
		});
		fs.writeFile(schedulesFolder + offSchedule3File, data.offDate, function (err) {
  			if (err) return console.log(err);
		});
		
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
		
		//write schedules to file
		fs.writeFile(schedulesFolder + onSchedule4File, data.onDate, function (err) { 
  			if (err) return console.log(err);
		});
		fs.writeFile(schedulesFolder + offSchedule4File, data.offDate, function (err) {
  			if (err) return console.log(err);
		});
		
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
    
	//=============================================================================
	// SWITCHING SOCKETS
	// listening sockets that handle switch state data coming from the client
	//=============================================================================
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