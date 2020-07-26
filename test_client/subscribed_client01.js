/*---------------------------------------------------------------------*/
/* subscribed_client01.js
/*---------------------------------------------------------------------*/
/* Application file: subscribed_client01.js                            */
/* Author: Arnab Adhikari(arnabadhikari93@gmail.com)       23.07.2020  */
/*---------------------------------------------------------------------*/
/* This application can be started on Node.JS Releases greater 12.XX   */
/* This application uses Socket.io library Release 2.0   	       */
/* This is the interested client who has subscribed to the server      * 
 * for receiving the alerts/monitoring data every 5 seconds.           */
/*---------------------------------------------------------------------*/ 
/* PLEASE DO NOT CHANGE THE BELOW CODE MANUALLY!                       */
/*---------------------------------------------------------------------*/

var axios= require("axios");									//importing the axios module 
const io = require("socket.io-client");								//importing the socket.io client library
const socket = io.connect('http://localhost:6002/',{reconnection: true,
						    reconnectionDelay: 1000,
						    reconnectionDelayMax : 5000,
						    reconnectionAttempts: 99999});      //connecting to the central server with reconnection parameters

var server_key;      //to store the unique key from server
var postJSON={"SID1":"REF01", "SID2":"ACR01", "Unique":"CLIENT1"};   			//JSON object to POST data

var url= "http://localhost:6002/api/registration/2";					//Subscription POST URL to POST data

//Checking if connection to server is successful(applicable for reconnection also)
socket.on('connect', function(){
	console.log("INFO: Connected to server with socket id:"+socket.id);
//	Axios POST call for subscription
	axios.post(url, postJSON)
	.then(function (response) {
		server_key=response.data;
		//ERROR checking for wrong URL
		if(server_key == "ERROR")
			console.log("ERROR: Length value in POST request URL does not match SIDs in JSON body");
		else
			console.log("INFO: Success in Registration and received the unique key from server:"+server_key);

		//emits an event to the server identified by the SERVER and CLIENT key pair
		socket.emit(server_key,postJSON.Unique);
	})
//	Runtime exception handling for POST request errors
	.catch(function (error) {
		console.log("ERROR in POST request");
	});
});

//event fired upon connection (including a successful reconnection) with the CLIENT unique key
socket.on(postJSON.Unique, function (data) {
	console.log("Server Data:"+JSON.stringify(data));
});

//event fired upon a connection error
socket.on('connect_error', function() {
	console.log('ERROR: Failed to connect to server');
});

