/*---------------------------------------------------------------------*/
/* sensor_client02.js
/*---------------------------------------------------------------------*/
/* Application file: sensor_client02.js                                */
/* Author: Arnab Adhikari(arnabadhikari93@gmail.com)       23.07.2020  */
/*---------------------------------------------------------------------*/
/* This application can be started on Node.JS Releases greater 12.XX   */
/* This application uses Socket.io library Release 2.0                 */
/* The sensor client is the simulated sensor in the task               *	
 * which sends temperature data to the server every 5 seconds.         *
 * Currently for demo purpose,                                         *		
 * it is sending a JSON with random whole integer temperature values.  */ 
/*---------------------------------------------------------------------*/ 
/* PLEASE DO NOT CHANGE THE BELOW CODE MANUALLY!                       */
/*---------------------------------------------------------------------*/

const io = require("socket.io-client");							//importing the socket.io client library

const socket = io.connect('http://localhost:6002/',{reconnection: true,
						    reconnectionDelay: 1000,
	                                            reconnectionDelayMax : 5000,
		                                    reconnectionAttempts: 99999});      //connecting to the central server with reconnection parameters

//Checking if connection to server is successful(applicable for reconnection also)
socket.on('connect', function(){
	console.log("INFO: Connected to server with socket id:"+socket.id);
});

//frequency of 5 seconds 
setInterval(() => {
	var date = new Date();      //current date,time of the server
	var now = date.getFullYear() +"-"+('0' + (date.getMonth() + 1)).slice(-2)+"-"+('0' + date.getDate()).slice(-2) +" " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
	var finalJSON={};          //to store final JSON to be sent to the server
	
	var ref_temp= Math.round(refrigerator_randomNumber(0,10));
	var acr_temp= Math.round(cooler_randomNumber(16,30));
	var rom_temp= Math.round(room_randomNumber(25,40));
	
	finalJSON["Timestamp"]=now;
	finalJSON["metrics"]=[{"SID":"REF02","Temperature":ref_temp},{"SID":"ACR02","Temperature":acr_temp},{"SID":"ROM02","Temperature":rom_temp}];

	//generates random temperature value for refrigerator
	function refrigerator_randomNumber(min, max) {
		return Math.random() * (max - min) + min;
	}

	//generates random temperature value for air-cooler
	function cooler_randomNumber(min, max) {
		return Math.random() * (max - min) + min;
	}

	//generates random temperature value for room
	function room_randomNumber(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	console.log("Sensor Client-2 to Server Data:"+JSON.stringify(finalJSON));

	//emits an event to the server identified by sensor02
	socket.emit('sensor02',finalJSON);},5000);   //5 seconds

//event fired upon a connection error
socket.on('connect_error', function() {
	console.log('ERROR: Failed to connect to server');
});

